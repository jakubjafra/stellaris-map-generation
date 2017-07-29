import re
import json
import sys

workdir = sys.argv[1]
file_name = sys.argv[2]

influences_file = open('{}/{}.dot'.format(workdir, file_name), 'r')
influences = influences_file.read()
influences_file.close()

background = re.search(r'graph\s\[_background=\"((.|\n)+?)\"', influences, flags=re.M | re.S).group(1)
background = background.replace('\\', '').replace('\n', '')
layers_raw = background.split(' c ')

layers = {}

for layer_str in layers_raw[1:]:
    layer_color = re.search(r'(#.+?)\s', layer_str, flags=re.M | re.S).group(1)
    layer_raw = 'c {}'.format(layer_str)
    layer_points_raw = re.findall(r'([-\d]+\.[\d]+)', layer_raw, flags=re.M | re.S)

    layer_points = []
    for index, number in enumerate(layer_points_raw):
        number = float(number)

        if index % 2 == 0:
            layer_points.append({'x': number})
        else:
            layer_points[len(layer_points) - 1]['y'] = number

    if layer_color not in layers:
        layers[layer_color] = []

    layers[layer_color].append(layer_points)

clusters_raw = influences.split('subgraph')

clusters = {}
count = 0

for cluster_str in clusters_raw[1:]:
    cluster_str = cluster_str.split('{')[1].split('}')[0]

    id_ = None
    graph_color = None

    try:
        id_ = re.search(r'id=[\"]*([-\d\w \']+?)[,\n"\]]', cluster_str, flags=re.M | re.S).group(1)
        graph_color = re.search(r'clustercolor="(.+?)"', cluster_str, flags=re.M | re.S).group(1)
    except:
        print cluster_str
        exit

    graph_polygons = layers[graph_color]
    count += len(graph_polygons)

    clusters[id_] = {
        'id': id_,
        'polygons': graph_polygons
    }

graph_file = open('{}/_{}.json'.format(workdir, file_name), 'w+')
graph_file.write(json.dumps(clusters))
graph_file.close()
