import initialGraph from "../../../data/miserables.json";

export function expandGroupNode(state: any, group_to_expand: number, group_to_expand_id: string, group_map: Map<number, boolean>) {
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