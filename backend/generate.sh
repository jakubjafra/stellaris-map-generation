#!/usr/bin/env bash

echo 'generating json...'
node sav2json.js
echo 'star-graph execution...'
(cd utils/star-graph && sh generate.sh)
echo 'copying...'
cp -r utils/star-graph/tests/ samples/end-game/graphs