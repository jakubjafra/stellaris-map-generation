#!/usr/bin/env bash

SAV=$1
OUT=$2

OUT_TMP="./tmp";

if [ -z "$OUT" ]; then
	OUT="./tmp";
fi

mkdir -p $OUT_TMP

echo 'generating json...'
node sav2json.js $SAV $OUT_TMP
echo 'star-graph execution...'
(cd utils/star-graph && sh generate.sh)
echo 'cleanup...'
mv $OUT_TMP/tmp-map-gen/*.json $OUT_TMP/
cp -r $OUT_TMP/ $OUT
rm -rf $OUT_TMP