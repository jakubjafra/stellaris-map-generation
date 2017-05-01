#!/usr/bin/env bash

python json2graph.py
neato tests/test.pv -n -Tpng -o tests/sample.png
gvmap -o tests/test_countries.pv tests/test.pv
neato tests/test_countries.pv -n -Tpng -o tests/sample_countries.png
open tests/sample_countries.png