from graphviz import Graph
import json


def generate(dot, data, for_map_generation):
    for name in data['stars']:
        star = data['stars'][name]

        pos = '{},{}!'.format(star['cords']['x'], star['cords']['y'])
        empire = None
        color = None

        if len(star['influencedBy']) > 0:
            influence_id = star['influencedBy'][0]['controlledBy']
            empire = data['empires'][influence_id]
            color = empire['color']

        def put_node():
            dot.node(name, label=name, clustercolor=color, pos=pos, shape='none')

        if for_map_generation:
            if empire:
                put_node()
                dot.edge(name, empire['capital']['star'], dir='none', color=color)
        else:
            put_node()


starsFile = open('../../samples/end-game/stars.json')
data = json.loads(starsFile.read())

dot = Graph(strict='true')
generate(dot, data, for_map_generation=True)
dot.render('./tests/empires.dot')

dot = Graph(strict='true')
generate(dot, data, for_map_generation=False)
dot.render('./tests/rest-stars.dot')
