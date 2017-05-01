#!/usr/bin/env bash

python json2graph.py
neato tests/rest-stars.dot -n -Tpng -o tests/rest-stars.png
gvmap -a 0 -O -c 1 -o tests/empires-influence.dot tests/empires.dot
neato tests/empires-influence.dot -n -Tpng -o tests/empires-influence.png
#python merge.py
#neato tests/merged.dot -n -Tpng -o tests/merged.png
#neato tests/only-map.dot -n -Tpng -o tests/only-map.png
#open tests/only-map.png
open tests/empires-influence.png