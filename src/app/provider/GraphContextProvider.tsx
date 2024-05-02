import React, {createContext, type FC, useReducer} from "react";
import {graphContextInitializer} from "./initializer/GraphInitialState";
import {GraphDataAction} from "./reducer/GraphReducerTypes";
import {graphCollapsedCommunity, graphExpandedCommunity} from "./reducer/GraphReducer";

export const GraphContext = createContext<any | null>(null);
export const GraphDispatchContext = createContext<any | null>(null);

/**
 * ForceGraphNotes
 * TODO: Source and Target must be a valid id => have their own Interface to guarantee that they function
 */

/**
 * GraphInitNotes
 * TODO: State should be defined by an Interface?
 * TODO: Maintain initialGraphJson as a State Object as a Mirror too ForceGraphData.
 */

/**
 * Manage all the interactions that can manipulate the GraphDataState,
 * first, loading and exporting a graph
 * second recognizing a collapsable (for now tree graph)
 * analysing a graph and recognizing graphs etc.? Recognizing tree leaves, recognizing what nodes need to be collapsed to collapse a given node?
 */


function graphDataReducer(state: any, action: GraphDataAction) {
    console.log('Graph Data Reducer Action: ' + action.type)
    switch (action.type) {
        case "expand_graph_node": {
            return graphExpandedCommunity(state, action)
        }
        case "collapse_graph_node": {
            return graphCollapsedCommunity(state, action)
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}


// TODO: Switch Case or other way to select which graphs to Init on...
// TODO: Different Graph Types require/Benefit from Different Decorations on ForceGraph React Component...
// TODO: How to extract things like Renderer from the ForceGraph React Component to manipulate the camera for instance...
function graphInit() {
    return graphContextInitializer();
}

// @ts-ignore
export const GraphProvider: FC<Props> = ({children}) => {


    function graphInitialState(): any {
        return {};
    }

    // @ts-ignore
    const [state, dispatch] = useReducer(graphDataReducer, graphInitialState(), graphInit);

    return (
        <GraphContext.Provider value={state}>
            <GraphDispatchContext.Provider value={dispatch}>
                {children}
            </GraphDispatchContext.Provider>
        </GraphContext.Provider>
    );
};
