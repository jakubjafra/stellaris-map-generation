Stellaris map generation
========================

Simple set of scripts bundled together with bash that:
* reads Paradox save game files for Stellaris
* parses them into JSON files via [jomini](https://github.com/nickbabcock) parser
* creates lightweight JSON data file containing basic information about empires, star systems etc.
* passes this "geo" data into [GraphViz](http://www.graphviz.org/Home.php) to create regions:
  * star systems
  * empires
  * sectors
  * "independencies" - alliances and independent empires
* those files can be used combined with data from save game to generate nice graphs with detailed information about game

Usage
-----

1. Locate Stellaris save game folder of your system.
  - On my Mac it's: ```/Users/<username>/Documents/Paradox Interactive/Stellaris/save games```
2. Locate ".sav" files. Copy them somewhere, and unzip it (they are really just ```zip``` archives)
3. Inside there are 2 files. We're interesed in ```gamestate``` file
4. Run:
```
sh generate.sh <your-gamestate-file-location> <output-directory>
```
5. Enjoy the data!
6. Pull request and forks are welcome. This game really needs better reporting!

Requirements
------------

To run scripts you need an Unix system with:
* ```bash```
* ```graphviz``` and ```neato``` execs on the system
* ```node.js``` (tested on ```v6.9.4```)
* ```python``` (it's using ```2.7.13``` for some reason... not sure if the libs are working)
* installed dependencies (```npm i```, ```pip install -r utils/star-graph/requirments.txt```)
* feel free to update this if I forgot about some lib