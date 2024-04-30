import Graph from 'graphology';
import {clusters} from 'graphology-generators/random';



function expand(order: number, size: number, cluster: number) {

    const graph = clusters(Graph, {
        order: order,
        size: size,
        clusters: cluster,
    })
    const cluster_map = {}
    const link_map = []
    // @ts-ignore
    graph.forEachNode(node => {
        const node_attributes = graph.getNodeAttributes(node);
        // @ts-ignore
        var cluster = cluster_map[node_attributes.cluster] || {
            cluster_nuber: node_attributes.cluster,
            cluster_size: 0,
            cluster_visibility: true,
            nodes: [],
        }

        // @ts-ignore
        cluster_map[node_attributes.cluster] = cluster;

        graph.updateNode(node, (attributes: any) => {
            return {
                ...attributes,
                id: node,
                name: node + 'name',
                val: 1,
                nodeVisibility: true,
                cluster: cluster.cluster_nuber
            }
        })

        cluster.nodes.push(node);
        cluster.cluster_size += 1;

    })

    // create a node for each cluster
    for (const clusterMapKey in cluster_map) {
        graph.addNode(graph.order + 1, {
            id: graph.order + 1,
            name: graph.order + 1 + 'name',
            // @ts-ignore
            val: cluster_map[clusterMapKey].cluster_size,
            nodeVisibility: false,
            // @ts-ignore
            cluster_members: cluster_map[clusterMapKey].nodes
        })
    }

    graph.forEachEdge(
        // @ts-ignore
        (edge, attributes, source, target, sourceAttributes, targetAttributes) => {
            console.log(`Edge from ${source} to ${target}`);
            link_map.push({
                source: source,
                target: target,
                linkVisibility: true
            })
        });

    // value of a link is a source cluster, target cluster, visibility
    // visibility can be pointers onto nodes?
    // if target and source are different clusters create a link in a map, remove duplicates?

    return graph
}

describe('testing group expansion', () => {

    const expected_length: number = 50;

    test('empty string should result in zero', () => {
        expect(expand(expected_length,250,7).nodes()).toHaveLength(expected_length)
    });
});

export {}
