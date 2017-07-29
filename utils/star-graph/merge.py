import re
import sys

workdir = sys.argv[1]

border_file = open('{}/empires-influence.dot'.format(workdir), 'r')
border_graph = re.search(r'(graph\s\[(.|\n)+?)\];', border_file.read(), flags=re.M | re.S).group(0)
border_file.close()

rest_file = open('{}/all-stars.dot'.format(workdir), 'r')
rest_graph = re.search(r'graph\s{((.|\n)+)}', rest_file.read(), flags=re.M | re.S).group(1)
rest_file.close()

merged = 'strict graph {{{}{}}}'.format(border_graph, rest_graph)
merged_file = open('{}/merged.dot'.format(workdir), 'w+')
merged_file.write(merged)
merged_file.close()

only_map = 'strict graph {{{}}}'.format(border_graph)
only_map_file = open('{}/only-map.dot'.format(workdir), 'w+')
only_map_file.write(only_map)
only_map_file.close()
