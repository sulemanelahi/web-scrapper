const http = require("node:http");
const url = require("node:url");
const async = require("async");
const { getTitle } = require("./utils/helperFunctions");

const server = http.createServer((req, res) => {
    const addresses = [];

    const parsedUrl = url.parse(req.url, true);

    if (typeof parsedUrl.query.address === "string") addresses.push(parsedUrl.query.address);
    if (Array.isArray(parsedUrl.query.address)) addresses.push(...parsedUrl.query.address);

    if (parsedUrl.pathname === "/I/want/title") {
        async.map(
            addresses,
            (address, callback) => {
                getTitle(address, (err, title) => {
                    callback(err, { address, title });
                });
            },
            (err, results) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Internal Server Error");
                }

                const listItems = [];
                
                results.forEach(({ address, title }) => {
                    listItems.push(`<li>${address} - "${title}"</li>`);
                });

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
        );
    } else {
        res.writeHead(404);
        res.end("404 Not Found");
    }
});

server.listen(3000, () => console.log("Async.js Callback version running on 3000"));
