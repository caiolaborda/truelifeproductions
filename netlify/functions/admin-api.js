const { getStore, connectLambda } = require("@netlify/blobs");
const crypto = require("crypto");

const AUTH_SALT = "tlp-cic-auth-v2-2026:";
const EXPECTED_HASH = "b6ba0fe5d259baaa0ba5186fcd32d645b87947440f99e11be6e8d49d4151a3e5";

function isAuthorized(authInput) {
    if (!authInput || typeof authInput !== "string") return false;
    if (process.env.ADMIN_PASSWORD && authInput === process.env.ADMIN_PASSWORD) {
        return true;
    }
    const candidateHash = crypto
        .createHash("sha256")
        .update(AUTH_SALT + authInput, "utf8")
        .digest("hex");
    try {
        return crypto.timingSafeEqual(
            Buffer.from(candidateHash, "hex"),
            Buffer.from(EXPECTED_HASH, "hex")
        );
    } catch (e) {
        return false;
    }
}

function parseDataUrl(dataUrl) {
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null;
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    const contentType = match[1];
    const base64 = match[2];
    let ext = "jpg";
    if (contentType.includes("mp4")) ext = "mp4";
    else if (contentType.includes("webm")) ext = "webm";
    else if (contentType.includes("ogg")) ext = "ogg";
    else if (contentType.includes("quicktime") || contentType.includes("mov")) ext = "mov";
    else if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";

    const hash = crypto.createHash("sha1").update(base64).digest("hex").slice(0, 20);
    const id = `media_${hash}.${ext}`;
    return { id, contentType, base64, url: `/.netlify/functions/admin-api?type=media&id=${id}` };
}

async function offloadInlineDataUrls(store, value) {
    if (typeof value === "string") {
        if (value.startsWith("data:") && value.length > 2048) {
            const parsed = parseDataUrl(value);
            if (parsed) {
                await store.setJSON(parsed.id, {
                    contentType: parsed.contentType,
                    base64: parsed.base64
                });
                return parsed.url;
            }
        }
        return value;
    }
    if (Array.isArray(value)) {
        const result = [];
        for (const item of value) {
            result.push(await offloadInlineDataUrls(store, item));
        }
        return result;
    }
    if (value && typeof value === "object") {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = await offloadInlineDataUrls(store, v);
        }
        return out;
    }
    return value;
}

exports.handler = async (event, context) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    };

    // Handle preflight CORS
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        // Initialize Netlify Blobs runtime context for Lambda compatibility mode
        if (typeof connectLambda === "function") {
            try {
                connectLambda(event);
            } catch (lambdaErr) {
                console.warn("connectLambda initialization note:", lambdaErr.message);
            }
        }

        const storeOptions = {
            name: "tlp-live-data",
            consistency: "eventual"
        };

        const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
        const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
        if (siteID && token) {
            storeOptions.siteID = siteID;
            storeOptions.token = token;
        }

        const store = getStore(storeOptions);

        // GET: Fetch live data or binary media blob
        if (event.httpMethod === "GET") {
            const type = (event.queryStringParameters && event.queryStringParameters.type) || "all";

            if (type === "media") {
                const mediaId = event.queryStringParameters && event.queryStringParameters.id;
                if (!mediaId || !mediaId.startsWith("media_")) {
                    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid media id" }) };
                }
                const mediaObj = await store.get(mediaId, { type: "json" });
                if (!mediaObj || !mediaObj.base64) {
                    return { statusCode: 404, headers, body: JSON.stringify({ error: "Media not found" }) };
                }
                return {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": mediaObj.contentType || "image/jpeg",
                        "Cache-Control": "public, max-age=31536000, immutable"
                    },
                    body: mediaObj.base64,
                    isBase64Encoded: true
                };
            }

            if (type === "all") {
                const settings = await store.get("settings", { type: "json" });
                const productions = await store.get("productions", { type: "json" });
                const team = await store.get("team", { type: "json" });
                const workshops = await store.get("workshops", { type: "json" });
                const about = await store.get("about", { type: "json" });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        settings: settings || null,
                        productions: productions || null,
                        team: team || null,
                        workshops: workshops || null,
                        about: about || null
                    })
                };
            }

            const data = await store.get(type, { type: "json" });
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ data: data || null })
            };
        }

        // POST: Save updated data
        if (event.httpMethod === "POST") {
            let body = {};
            try {
                body = JSON.parse(event.body || "{}");
            } catch (e) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
            }

            // Allow unauthenticated client recovery_backup slot
            if (body.type === "recovery_backup" && body.data) {
                await store.setJSON(`recovery_backup_${Date.now()}`, body.data);
                return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
            }

            if (!isAuthorized(body.auth)) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized passcode" }) };
            }

            const { type, data } = body;
            if (type === "verify") {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };
            }
            if (type === "upload_media" && data && data.dataUrl) {
                const parsed = parseDataUrl(data.dataUrl);
                if (!parsed) {
                    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid media data URL" }) };
                }
                await store.setJSON(parsed.id, {
                    contentType: parsed.contentType,
                    base64: parsed.base64
                });
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        id: parsed.id,
                        url: parsed.url
                    })
                };
            }
            if (!type || !data) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing type or data" }) };
            }

            // Automatically save a backup of current state before overwriting
            const prev = await store.get(type === "all" ? "productions" : type, { type: "json" });
            if (prev) {
                await store.setJSON(`backup_${type}`, prev);
            }

            if (type === "all") {
                if (data.settings) await store.setJSON("settings", await offloadInlineDataUrls(store, data.settings));
                if (data.productions) await store.setJSON("productions", await offloadInlineDataUrls(store, data.productions));
                if (data.team) await store.setJSON("team", await offloadInlineDataUrls(store, data.team));
                if (data.workshops) await store.setJSON("workshops", await offloadInlineDataUrls(store, data.workshops));
                if (data.about) await store.setJSON("about", await offloadInlineDataUrls(store, data.about));
            } else {
                const cleanedData = await offloadInlineDataUrls(store, data);
                await store.setJSON(type, cleanedData);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: `${type} saved and synced globally to live website.`
                })
            };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    } catch (err) {
        console.error("Netlify Admin API Error:", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message || "Internal server error" })
        };
    }
};
