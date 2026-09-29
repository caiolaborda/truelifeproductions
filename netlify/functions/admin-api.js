const { getStore } = require("@netlify/blobs");

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
        const store = getStore({
            name: "tlp-live-data",
            consistency: "strong"
        });

        // GET: Fetch live data
        if (event.httpMethod === "GET") {
            const type = (event.queryStringParameters && event.queryStringParameters.type) || "all";

            if (type === "all") {
                const settings = await store.get("settings", { type: "json" });
                const productions = await store.get("productions", { type: "json" });
                const team = await store.get("team", { type: "json" });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        settings: settings || null,
                        productions: productions || null,
                        team: team || null
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

            if (body.auth !== "admin") {
                return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized passcode" }) };
            }

            const { type, data } = body;
            if (!type || !data) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing type or data" }) };
            }

            if (type === "all") {
                if (data.settings) await store.setJSON("settings", data.settings);
                if (data.productions) await store.setJSON("productions", data.productions);
                if (data.team) await store.setJSON("team", data.team);
            } else {
                await store.setJSON(type, data);
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
