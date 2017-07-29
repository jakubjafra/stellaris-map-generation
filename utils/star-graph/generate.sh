#!/usr/bin/env bash

SOURCEDIR_TMP='../../tmp'
WORKDIR_TMP='../../tmp/tmp-map-gen'
mkdir -p $WORKDIR_TMP

python json2graph.py $SOURCEDIR_TMP $WORKDIR_TMP
neato $WORKDIR_TMP/all-stars.dot -n -Tpng -o $WORKDIR_TMP/all-stars.png
neato $WORKDIR_TMP/sectors.dot -n -Tpng -o $WORKDIR_TMP/sectors.png
neato $WORKDIR_TMP/hyperlanes.dot -Tpng -o $WORKDIR_TMP/hyperlanes.png
gvmap -D -c 8 -a 0 -b -1 -o $WORKDIR_TMP/empires-influence.dot $WORKDIR_TMP/empires.dot
gvmap -D -O -c 8 -a 0 -b -1 -o $WORKDIR_TMP/all-stars-influence.dot $WORKDIR_TMP/all-stars.dot
gvmap -D -O -c 8 -a 0 -b -1 -o $WORKDIR_TMP/sectors-influence.dot $WORKDIR_TMP/sectors.dot
gvmap -D -O -c 8 -a 0 -b -1 -o $WORKDIR_TMP/independencies-influence.dot $WORKDIR_TMP/independencies.dot
python graph2polygons.py $WORKDIR_TMP empires-influence
python graph2polygons.py $WORKDIR_TMP all-stars-influence
python graph2polygons.py $WORKDIR_TMP sectors-influence
python graph2polygons.py $WORKDIR_TMP independencies-influence
neato $WORKDIR_TMP/empires-influence.dot -n -Tpng -o $WORKDIR_TMP/empires-influence.png
neato $WORKDIR_TMP/all-stars-influence.dot -n -Tpng -o $WORKDIR_TMP/all-stars-influence.png
neato $WORKDIR_TMP/sectors-influence.dot -n -Tpng -o $WORKDIR_TMP/sectors-influence.png
neato $WORKDIR_TMP/independencies-influence.dot -n -Tpng -o $WORKDIR_TMP/independencies-influence.png
python merge.py $WORKDIR_TMP
neato $WORKDIR_TMP/merged.dot -n -Tpng -o $WORKDIR_TMP/merged.png
neato $WORKDIR_TMP/only-map.dot -n -Tpng -o $WORKDIR_TMP/only-map.png