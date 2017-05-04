const express = require('express');
const fs = require('fs');

const app = express();

app.get(/\/api\/(.+)/, function (req, res) {
    const sampleName = req.params['0'];

    try {
        res
            .set('Content-Type', 'application/json')
            .status(200)
            .send(fs.readFileSync(`../backend/samples/${sampleName}`).toString());
    } catch(e){
        res.status(404).send('Not found.');
    }
});

app.get('/', function(req, res){
    res
        .set('Content-Type', 'text/html')
        .status(200)
        .send(fs.readFileSync(`./public/templates/index.html`).toString());
});

app.get('/:sampleName', function(req, res){
    res
        .set('Content-Type', 'text/html')
        .status(200)
        .send(fs.readFileSync(`./public/templates/stats.html`).toString());
});

app.use('/assets', express.static('./assets'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});