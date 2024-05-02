import {collapseGroupOfNode} from "./dispatches/collapseCommunity";
import {expandGroupNode} from "./dispatches/expandCommunity";

// TODO: Validation of Graph Manipulation could be seeded here.


/**
 *
 * @param state
 * @param action
 */
export function graphCollapsedCommunity(state: any, action:any) {
    var new_expanded_graphs_w: Map<number, boolean> = new Map(state.expanded_graphs)
    new_expanded_graphs_w.set(action.payload.group, false)
    return {
        ...state,
        expanded_graphs: new_expanded_graphs_w,
        force_graph: collapseGroupOfNode(state, action.payload.group)
    }
}

/**
 *
 * @param state
 * @param action
 */
export function graphExpandedCommunity(state:any, action:any) {
    //Update the expanded Graphs Mapping
    var new_expanded_graphs: Map<number, boolean> = new Map(state.expanded_graphs)
    new_expanded_graphs.set(action.payload.group, true)
    return {
        ...state,
        expanded_graphs: new_expanded_graphs,
        force_graph: expandGroupNode(state, action.payload.group, action.payload.id, new_expanded_graphs)
    }
}