#!/usr/bin/env bash

node sav2json.js
(cd utils/star-graph && sh generate.sh)
cp -r utils/star-graph/tests samples/end-game/graphs