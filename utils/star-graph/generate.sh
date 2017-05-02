#!/usr/bin/env bash

python json2graph.py
neato tests/all-stars.dot -n -Tpng -o tests/all-stars.png
gvmap -D -c 8 -a 0 -b -1 -o tests/empires-influence.dot tests/empires.dot
gvmap -D -O -c 8 -a 0 -b -1 -o tests/all-stars-influence.dot tests/all-stars.dot
python graph2polygons.py empires-influence
python graph2polygons.py all-stars-influence
neato tests/empires-influence.dot -n -Tpng -o tests/empires-influence.png
neato tests/all-stars-influence.dot -n -Tpng -o tests/all-stars-influence.png
python merge.py
neato tests/merged.dot -n -Tpng -o tests/merged.png
neato tests/only-map.dot -n -Tpng -o tests/only-map.png