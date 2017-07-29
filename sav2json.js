const fs = require('fs');
const jomini = require('jomini');
const handleBasics = require('./utils/data-mining/basics.js');

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

const basics = handleBasics(save);
fs.writeFileSync(`./samples/${testedFile}/basics.json`, JSON.stringify(basics));