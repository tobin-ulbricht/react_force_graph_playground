export type GraphDataAction = {
    type: 'load_graph' | 'collapse_graph_node' | 'expand_graph_node';
    payload?: any;
}