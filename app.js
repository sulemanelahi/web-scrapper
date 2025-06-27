const http = require("node:http");
const url = require("node:url");
const { getTitle } = require("./utils/helperFunctions");

const server = http.createServer((req, res) => {
    const addresses = [];
    const sites = {};

    const parsedUrl = url.parse(req.url, true);

    let completed = 0;

    if (typeof parsedUrl.query.address === "string") addresses.push(parsedUrl.query.address);
    if (Array.isArray(parsedUrl.query.address)) addresses.push(...parsedUrl.query.address);

    if (parsedUrl.pathname === "/I/want/title") {
        addresses.forEach((address) => {
            getTitle(address, (err, title) => {
                sites[address] = title;
                completed++;

                if (completed === addresses.length) {
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

                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(html);
                }
            });
        });
    } else {
        res.writeHead(404);
        res.end("404 Not Found");
    }
});

server.listen(3000, () => console.log("Callback version running on 3000"));
