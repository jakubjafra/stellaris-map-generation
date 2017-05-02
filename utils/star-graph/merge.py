import re

border_file = open('./tests/empires-influence.dot', 'r')
border_graph = re.search(r'(graph\s\[(.|\n)+?)\];', border_file.read(), flags=re.M | re.S).group(0)
border_file.close()

rest_file = open('./tests/all-stars.dot', 'r')
rest_graph = re.search(r'graph\s{((.|\n)+)}', rest_file.read(), flags=re.M | re.S).group(1)
rest_file.close()

merged = 'strict graph {{{}{}}}'.format(border_graph, rest_graph)
merged_file = open('./tests/merged.dot', 'w+')
merged_file.write(merged)
merged_file.close()

only_map = 'strict graph {{{}}}'.format(border_graph)
only_map_file = open('./tests/only-map.dot', 'w+')
only_map_file.write(only_map)
only_map_file.close()
