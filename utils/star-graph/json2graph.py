from graphviz import Digraph
import json

dot = Digraph(strict='true')

starsFile = open('../../samples/end-game/stars.json')
data = json.loads(starsFile.read())

for name in data['stars']:
    star = data['stars'][name]

    pos = '{},{}!'.format(star['cords']['x'], star['cords']['y'])

    dot.node(name, name, pos=pos)

dot.render('./tests/test.pv')
