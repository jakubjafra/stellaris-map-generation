const fs = require('fs');
const jomini = require('jomini');
const handleData = require('./utils/data-mining/stars.js');

const testedFile = 'end-game';

let save = null;

try {
    const jsonFile = fs.readFileSync(`./samples/${testedFile}/gamestate.json`);
    save = JSON.parse(jsonFile.toString());
} catch(e){
    const file = fs.readFileSync(`./samples/${testedFile}/gamestate`).toString();
    save = jomini.parse(file);
    fs.writeFileSync(`./samples/${testedFile}/gamestate.json`, JSON.stringify(save));
}

const stars = handleData(save);
fs.writeFileSync(`./samples/${testedFile}/stars.json`, JSON.stringify(stars));