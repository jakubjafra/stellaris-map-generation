from graphviz import Digraph
import json

dot = Digraph(strict='true')

starsFile = open('../../samples/end-game/stars.json')
data = json.loads(starsFile.read())

for name in data['stars']:
    star = data['stars'][name]

    pos = '{},{}!'.format(2 * star['cords']['x'], 2 * star['cords']['y'])
    empire = None
    color = None

    if len(star['influencedBy']) > 0:
        influenceId = star['influencedBy'][0]['controlledBy']
        empire = data['empires'][influenceId]
        color = empire['color']

    dot.node(name, label=name, color=color, pos=pos, shape='none')
    if empire:
        dot.edge(name, empire['capital']['star'], dir='none', color=color)

dot.render('./tests/test.pv')
