const fs = require('fs');
const jomini = require('jomini');
const handleBasics = require('./data-parser/basics.js');

const fileToProcess = process.argv[2];
const outputDir = process.argv[3] || "./tmp";

const file = fs.readFileSync(fileToProcess).toString();

let save = jomini.parse(file);
fs.writeFileSync(`${outputDir}/gamestate.json`, JSON.stringify(save));

const basics = handleBasics(save);
fs.writeFileSync(`${outputDir}/basics.json`, JSON.stringify(basics));