'use client'

import ForceGraph3D from "react-force-graph-3d";
import React, {useCallback, useContext} from 'react';

import {GraphContext, GraphDispatchContext} from '../provider/GraphContextProvider';
// import data from "../data/miserables.json"
/**
 *
 * @param ref
 * @constructor
 *
 * TODO: Create a File to Manage ForceGraph3D decorators? like color etc...
 */

// eslint-disable-next-line no-empty-pattern
function Graph({}, ref: any) {
    const dispatch = useContext(GraphDispatchContext);
    const graphContext = useContext(GraphContext);

    const handleClick = useCallback((node: { id: string; x: number; y: number; z: number; collapsed: boolean; }) => {
        // does this node.id really work, for les Miserabl yes, for generated Graph?
        // TODO Build a ER Diagramm where I can find what Info I need for which functions
        if (node.id.includes("group")) {
            console.log("Disp. Expand Community")
            dispatch({
                type: 'expand_graph_node',
                payload: node,
            })
        } else {
            console.log("Disp. Collapse Community")
            dispatch({
                type: 'collapse_graph_node',
                payload: node,
            })
        }

    }, [dispatch]);


    return (
        <ForceGraph3D
            ref={ref}
            // @ts-ignore
            graphData={graphContext.force_graph}
            nodeLabel="name"
            nodeVisibility={(node) => {
                return node.nodeVisibility;
            }}
            nodeVal="nodeVal"
            nodeAutoColorBy="cluster"
            onNodeClick={handleClick}
            // onNodeRightClick={(node) => {
            //     node.nodeVisibility = node.nodeVisibility!;
            // }}
            // onLinkClick={linkClick}
        />
    );
}

export default React.forwardRef(Graph);