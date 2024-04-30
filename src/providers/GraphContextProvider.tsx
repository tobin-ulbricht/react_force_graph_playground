import React, {createContext, type FC, useReducer} from "react";
import initialGraph from '../data_graphs/miserables.json';
import {clusters} from "graphology-generators/random";
import Graph from "graphology";
// import type {Props} from "next/script";


export const GraphContext = createContext<any | null>(null);
export const GraphDispatchContext = createContext<any | null>(null);

type GraphDataAction = {
    type: 'load_graph' | 'collapse_graph_node' | 'expand_graph_node';
    payload?: any;
}

/**
 * Manage all the interactions that can manipulate the GraphDataState,
 * first, loading and exporting a graph
 * second recognizing a collapsable (for now tree graph)
 * analysing a graph and recognizing graphs etc.? Recognizing tree leaves, recognizing what nodes need to be collapsed to collapse a given node?
 */

export function graphDataReducer(state: any, action: GraphDataAction) {
    console.log('Graph Data Reducer Action: ' + action.type)

    switch (action.type) {
        case "load_graph": {

            // If Else distinction of wether a graph is a tree and the collapsable stuff works with that or not

            return {
                graph: action.payload,
                random: "something something",
                graph_loaded: true,
                force_graph_data: state.force_graph_data,
            }
        }
        case "expand_graph_node": {
            //Update the expanded Graphs Mapping
            var new_expanded_graphs: Map<number, boolean> = new Map(state.expanded_graphs)
            new_expanded_graphs.set(action.payload.group, true)
            return {
                ...state,
                expanded_graphs: new_expanded_graphs,
                force_graph: expandGroupNode(state, action.payload.group, action.payload.id, new_expanded_graphs)
            }
        }
        case "collapse_graph_node": {
            var new_expanded_graphs_w: Map<number, boolean> = new Map(state.expanded_graphs)
            new_expanded_graphs_w.set(action.payload.group, false)
            return {
                ...state,
                expanded_graphs: new_expanded_graphs_w,
                force_graph: collapseGroupOfNode(state, action.payload.group)
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

function collapseGroupOfNode(state: any, group: number) {

    var old_nodes = state.force_graph.nodes;
    var old_links = state.force_graph.links;

    var new_group_node = {id: "group" + group, group: group, size: 0, nodes: []};
    var new_nodes = [];
    // @ts-ignore
    var new_links = [];

    // determine nodes
    for (var i = 0; i < old_nodes.length; i++) {
        var old_node: nodeType = old_nodes[i]

        //do not pass old nodes into new nodes, create a new group node.
        //how to ensure that the new node group Id's are not conflicting?
        //need to assign nodes to new group node.
        // size zero is a collapsed cluster or a new cluster
        if (old_node.group === group) {
            // @ts-ignore
            new_group_node.nodes.push(old_node);
            new_group_node.size++;
        } else {
            new_nodes.push(old_node);
        }
    }
    new_nodes.push(new_group_node);

    var group_child_nodes: string[] = new_group_node.nodes.map((node: any) => node.id)
    for (let i = 0; i < old_links.length; i++) {
        var old_link = old_links[i];
        var source = old_link.source.id;
        var target = old_link.target.id;

        if (!group_child_nodes.includes(source) && !group_child_nodes.includes(target)) {
            new_links.push(old_link)
        } else {
            if (source !== new_group_node.id && !group_child_nodes.includes(source)) {
                var new_link = {
                    source: source,
                    target: new_group_node.id,
                    value: 0
                }
                // @ts-ignore
                if (!new_links.includes(new_link)) new_links.push(new_link)
            }
            if (group_child_nodes.includes(source) && !group_child_nodes.includes(target)) {
                new_link = {
                    source: new_group_node.id,
                    target: target,
                    value: 0
                }
                // @ts-ignore
                if (!new_links.includes(new_link)) new_links.push(new_link)
            }
        }
    }

    return {
        nodes: new_nodes,
        links: new_links
    }
}

// TODO: Expansion is creating Multiple links.
function expandGroupNode(state: any, group_to_expand: number, group_to_expand_id: string, group_map: Map<number, boolean>) {
    const old_nodes = state.force_graph.nodes;
    const old_links = state.force_graph.links;

    const new_nodes = [];
    const new_links = [];

    let group_node_ids: string[] = [];
    // push everything except expanded groups
    //push all links except ones that connect to old group node!
    //remove links firs

    for (let i = 0; i < old_nodes.length; i++) {

        //If a group is already expanded. there are no child nodes....
        if (old_nodes[i].group === group_to_expand) {
            //group node we want to expand
            // @ts-ignore
            group_node_ids = old_nodes[i].nodes.map(nodes => nodes.id)

            for (let j = 0; j < state.force_graph.nodes[i].nodes.length; j++) {
                const new_child_node = state.force_graph.nodes[i].nodes[j];


                new_nodes.push(new_child_node)
            }
        } else {
            //push all collapsed group nodes
            new_nodes.push(state.force_graph.nodes[i])
        }
    }

    // pass links that are not affected by expanded nodes...
    for (let i = 0; i < old_links.length; i++) {

        //do not parse links that have the same source and origin.
        if (old_links[i].target !== old_links[i].source) {
            //push all links that do not target or source from an expanded group
            if (old_links[i].target.group !== group_to_expand && old_links[i].source.group !== group_to_expand) {
                const new_link = {
                    source: old_links[i].source,
                    target: old_links[i].target,
                    value: 0
                }
                new_links.push(new_link)
            }
        }
    }
    // @ts-ignore
    const old_external_links = old_links.filter(link => link.target === group_to_expand_id || link.source === group_to_expand_id)

    // @ts-ignore
    const incoming_links = initialGraph.links.filter(link => group_node_ids.includes(link.target));
    // @ts-ignore
    const outgoing_links = initialGraph.links.filter(link => group_node_ids.includes(link.source));
    const links = new Set(incoming_links.concat(outgoing_links));
    for (const link of links) {

        if (group_node_ids.includes(link.source) && group_node_ids.includes(link.target)) {
            const new_link = {
                source: link.source,
                target: link.target,
                value: link.value
            }
            new_links.push(new_link)
        } else {
            //Links that target the group, or other groups
            if (group_node_ids.includes(link.target)) {
                // @ts-ignore
                var source_group = new_nodes.find(node => node.group === initialGraph.nodes.find(node => node.id === link.source).group);
                var source_group_id = "group" + source_group.group.toString()
                const new_link = {
                    source: source_group_id,
                    target: link.target,
                    value: link.value
                }
                if (group_map.get(source_group.group)) new_link.source = link.source
                new_links.push(new_link)
            }

            if (group_node_ids.includes(link.source)) {
                // @ts-ignore
                var target_group = new_nodes.find(node => node.group === initialGraph.nodes.find(node => node.id === link.target).group);
                var target_group_id = "group" + target_group.group.toString()
                const new_link = {
                    source: link.source,
                    target: target_group_id,
                    value: link.value
                }
                if (group_map.get(target_group.group)) new_link.target = link.target
                new_links.push(new_link)
            }

            for (const old_link of old_external_links) {
                console.log(old_link)
                if (old_link.target === link.target) {
                    const new_link = {
                        source: old_link.source,
                        target: link.target,
                        value: old_link.value
                    }
                    new_links.push(new_link)
                }
            }
        }
    }
    return {
        nodes: new_nodes,
        links: new_links
    }
}

/**
 * ForceGraphNotes
 * TODO: Source and Target must be a valid id => have their own Interface to guarantee that they function
 */


/**
 * GraphInitNotes
 * TODO: State should be defined by an Interface?
 * TODO: Maintain initialGraphJson as a State Object as a Mirror too ForceGraphData.
 */

interface groupDataType {
    group: number;
    size: number;
    nodes: [];
}

interface nodeType {
    id: string;
    group: number;
    group_data?: groupDataType;
    name?: string;
    val?: number;
}
function createNetworkGraph(data: {
    nodes: any;
    links?: { source: string; target: string; value: number; }[];
}, collapsedGroups: number[]) {

    var group_map = {},
        node_map = {},    // node map
        link_map = {},    // link map
        nodes = [], // output nodes
        links: never[] = []; // output links

    var nodeToGroupMap = new Map<any, any>()
    var groupNodeToGroupId = new Map<any, any>()
    // determine nodes
    for (var i = 0; i < data.nodes.length; i++) {
        var node: nodeType = data.nodes[i],
            node_group_index: number = node.group

        // @ts-ignore
        var new_group = group_map[node_group_index] || {
            id: "group" + node_group_index,
            group: node_group_index,
            nodeVal: 0,
            nodeRelSize: 8,
            nodes: []
        };
        // @ts-ignore
        group_map[node_group_index] = group_map[node_group_index] || new_group;

        // size zero is a collapsed cluster or a new cluster
        if (new_group.nodeVal === 0) {
            // if new cluster, add to set and position at centroid of leaf nodes
            // @ts-ignore
            node_map[i] = nodes.length;
            nodes.push(new_group);
            groupNodeToGroupId.set(new_group.group, new_group.id);
        }
        // @ts-ignore
        new_group.nodes.push(node);
        new_group.nodeVal += 1;
        nodeToGroupMap.set(data.nodes[i].id, data.nodes[i].group);
    }

    // for (const groupMapKey in group_map) {
    //     // group_map[groupMapKey].link_count = 0;
    // }

    //@ts-ignore
    for (var k = 0; k < data.links.length; k++) {
        // @ts-ignore
        let source: string = groupNodeToGroupId.get(nodeToGroupMap.get(data.links[k].source));
        // @ts-ignore
        let target: string = groupNodeToGroupId.get(nodeToGroupMap.get(data.links[k].target));

        // if expanded u is nodemap value of e.source.name, e is a data.link value
        // @ts-ignore
        const i = (source < target ? source + "|" + target : target + "|" + source);
        // @ts-ignore
        const link = link_map[i] || (link_map[i] = {
            source: source,
            target: target,
            value: 0
        });
        link.value += 1;
    }
    for (const linkMapKey in link_map) {
        // @ts-ignore
        links.push(link_map[linkMapKey])
    }
    return {
        nodes: nodes,
        links: links
    };
}

const graphContextInitializer = (initialState: any) => {
    // @ts-ignore
    let expanded_map = new Map<number, boolean>();

    for (let i = 0; i < initialGraph.nodes.length; i++) {
        const node = initialGraph.nodes[i];
        if (!expanded_map.has(node.group)) expanded_map.set(node.group, false);
    }

    // @ts-ignore
    let nodes = []
    let edges = []

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
        // @ts-ignore
        console.log(nodes)
        // @ts-ignore
        console.log(link_map)
        return  {
            // @ts-ignore
            nodes: nodes,
            // @ts-ignore
            links: link_map
        }
    }

    return {
        initialGraphData: initialGraph,
        force_graph: expand(10000,20000,300),
        expanded_graphs: expanded_map
    }
}

// @ts-ignore
export const GraphProvider: FC<Props> = ({children}) => {

    function initialArgs(): any {
        return {};
    }

    const [state, dispatch] = useReducer(graphDataReducer, initialArgs(), graphContextInitializer);
    return (
        <GraphContext.Provider value={state}>
            <GraphDispatchContext.Provider value={dispatch}>
                {children}
            </GraphDispatchContext.Provider>
        </GraphContext.Provider>
    );
};
