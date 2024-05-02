import initialGraph from "../../data/miserables.json";
import {clusters} from "graphology-generators/random";
import Graph from "graphology";

//TODO try to create a Type for the InitialGraphState, would be good for the validation of loading an external graph for instance...


export const graphContextInitializer = () => {
    // @ts-ignore
    let expanded_map = new Map<number, boolean>();

    for (let i = 0; i < initialGraph.nodes.length; i++) {
        const node = initialGraph.nodes[i];
        if (!expanded_map.has(node.group)) expanded_map.set(node.group, false);
    }

    // @ts-ignore
    let nodes = []

    function expand(order: number, size: number, cluster: number) {

        const graph = clusters(Graph, {
            order: order,
            size: size,
            clusters: cluster,
        })
        const cluster_map = {}
        // @ts-ignore
        const link_map = []
        // @ts-ignore
        graph.forEachNode(node => {
            const node_attributes = graph.getNodeAttributes(node);
            // @ts-ignore
            var cluster = cluster_map[node_attributes.cluster] || {
                cluster_nuber: node_attributes.cluster,
                cluster_size: 0,
                cluster_visibility: false,
                nodes: [],
            }

            // @ts-ignore
            cluster_map[node_attributes.cluster] = cluster;

            graph.updateNode(node, (attributes: any) => {
                return {
                    ...attributes,
                    id: node,
                    name: node + 'member',
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
                name: graph.order + 1 + 'cluster',
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
                link_map.push({
                    source: source,
                    target: target,
                    linkVisibility: true
                })
            });

        // value of a link is a source cluster, target cluster, visibility
        // visibility can be pointers onto nodes?
        // if target and source are different clusters create a link in a map, remove duplicates?

        // @ts-ignore
        graph.forEachNode(node => {
            nodes.push(graph.getNodeAttributes(node))
        })
        return  {
            // @ts-ignore
            nodes: nodes,
            // @ts-ignore
            links: link_map
        }
    }

    return {
        initialGraphData: initialGraph,
        force_graph: expand(1000,1500,300),
        expanded_graphs: expanded_map
    }
}