const https = require("node:https");
const http = require("node:http");

module.exports.getTitle = async (siteUrl, callback) => {
    return new Promise((resolve, rejects) => {
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
                        resolve(match[1]);
                    } else {
                        resolve("NO RESPONSE");
                    }
                });
            }).on("error", () => rejects("NO RESPONSE"));
        } catch (err) {
            rejects("NO RESPONSE");
        }
    });
};

module.exports.generateListOfTitlesMarkup = (sites) => {
    const listItems = [];

    for (const address in sites) {
        const title = sites[address];

        listItems.push(`<li>${address} - "${title}"</li>`);
    }

    const html = `
                    <html>
                        <head></head>
                        <body>
                            <h1> Following are the titles of given websites: </h1>
                            <ul>${listItems.join("\n")}</ul>
                        </body>
                    </html>
                    `;

    return html;
};
