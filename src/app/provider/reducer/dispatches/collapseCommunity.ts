import {nodeType} from "../../GraphTypes";

export function collapseGroupOfNode(state: any, group: number) {

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