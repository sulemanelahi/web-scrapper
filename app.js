const http = require("node:http");
const url = require("node:url");
const { getTitle, generateListOfTitlesMarkup } = require("./utils/helperFunctions");

const server = http.createServer(async (req, res) => {
    const addresses = [];
    const sites = {};

    const parsedUrl = url.parse(req.url, true);

    if (typeof parsedUrl.query.address === "string") addresses.push(parsedUrl.query.address);
    if (Array.isArray(parsedUrl.query.address)) addresses.push(...parsedUrl.query.address);

    if (parsedUrl.pathname === "/I/want/title") {
        for (const address of addresses) {
            const title = await getTitle(address);

            sites[address] = title;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(generateListOfTitlesMarkup(sites));
    } else {
        res.writeHead(404);
        res.end("404 Not Found");
    }
});

server.listen(3000, () => console.log("Promise version running on 3000"));
