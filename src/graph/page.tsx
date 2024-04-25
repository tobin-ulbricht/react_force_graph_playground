'use client'

import ForceGraph3D from "react-force-graph-3d";
import React, {useCallback, useContext} from 'react';

import {GraphContext, GraphDispatchContext} from '../providers/GraphContextProvider';

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
        if(node.id.includes("group")) {
            dispatch({
                type: 'expand_graph_node',
                payload: node,
            })
        } else {
            dispatch({
                type: 'collapse_graph_node',
                payload: node,
            })
        }

    }, [dispatch]);

    const test = useCallback((node: { id: string; x: number; y: number; z: number; collapsed: boolean; }) => {
        console.log(node)
    }, []);
    return (
        <>
            <ForceGraph3D
                ref={ref}
                graphData={graphContext.force_graph}
                nodeLabel="id"
                nodeVal="nodeVal"
                nodeAutoColorBy="group"
                onNodeClick={handleClick}
                onNodeRightClick={test}
            />

        </>

    );
}

export default React.forwardRef(Graph);