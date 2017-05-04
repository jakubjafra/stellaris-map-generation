const http = require('http');
const fs = require('fs');

http
    .createServer(function (req, res) {
        const sampleName = req.url.slice(1);
        try {
            res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
            res.end(fs.readFileSync(`./samples/${sampleName}`));
        } catch(e){
            res.end('Not found.');
        }
    })
    .listen(9615);