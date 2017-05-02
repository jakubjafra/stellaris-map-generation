from graphviz import Graph
import json


def generate(dot, data, for_map_generation):
    clusters = {}

    for i, name in enumerate(data['stars']):
        star = data['stars'][name]

        pos = '{},{}!'.format(star['cords']['x'], star['cords']['y'])
        empire = None
        color = '{:02X}'.format(i)

        if len(star['influencedBy']) > 0:
            influence_id = star['influencedBy'][0]['controlledBy']
            empire = data['empires'][influence_id]
            color = empire['id']

        def put_node(graph):
            graph.node(name, pos=pos, shape='none', clustercolor=color)

        if for_map_generation:
            if empire:
                if empire['id'] not in clusters:
                    clusters[empire['id']] = Graph(name='cluster{}'.format(empire['id']), graph_attr={'id': empire['id'], 'name': empire['name']})

                put_node(clusters[empire['id']])
        else:
            if i not in clusters:
                clusters[i] = Graph(name='cluster{}'.format(i), graph_attr={'id': name})

            put_node(clusters[i])

    for name in clusters:
        cluster = clusters[name]
        dot.subgraph(graph=cluster)


starsFile = open('../../samples/end-game/stars.json')
data = json.loads(starsFile.read())

dot = Graph(strict='true')
generate(dot, data, for_map_generation=True)
dot.render('./tests/empires.dot')

dot = Graph(strict='true')
generate(dot, data, for_map_generation=False)
dot.render('./tests/all-stars.dot')
