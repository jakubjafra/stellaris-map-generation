const express = require('express');
const app = express();
const fs = require('fs');

app.get(/\/api\/(.+)/, function (req, res) {
    const sampleName = req.params['0'];

    try {
        res
            .set('Content-Type', 'application/json')
            .status(200)
            .send(fs.readFileSync(`./samples/${sampleName}`).toString());
    } catch(e){
        res.status(404).send('Not found.');
    }
});

app.use(express.static('frontend/public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});