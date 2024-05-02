import {nodeType} from "../GraphTypes";

export function createNetworkGraph(
    data: { nodes: any; links?: { source: string; target: string; value: number; }[]; },
    collapsedGroups: number[]) {

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