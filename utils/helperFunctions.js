const https = require("node:https");
const http = require("node:http");

module.exports.getTitle = (siteUrl, callback) => {
    let fullUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;

    if (fullUrl.split(".").length < 3 && !fullUrl.includes("www.")) fullUrl = fullUrl.replace("://", "://www.");

    const lib = fullUrl.startsWith("https") ? https : http;

    try {
        lib.get(fullUrl, (res) => {
            let body = "";

            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
                const match = body.match(/<title>([^<]*)<\/title>/i);

                if (match && match[1]) {
                    callback(null, match[1]);
                } else {
                    callback(null, "NO RESPONSE");
                }
            });
        }).on("error", () => callback(null, "NO RESPONSE"));
    } catch (err) {
        callback(err, "NO RESPONSE");
    }
};
