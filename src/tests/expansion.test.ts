import Graph from 'graphology';
import {clusters} from 'graphology-generators/random';

//

function expand(order: number, size: number, cluster: number) {

    const graph = clusters(Graph, {
        order: order,
        size: size,
        clusters: cluster
    })

    // convert graph into a force-graph-compatible structure, this func should accept a list of nodes and links? Define a minimum input necessary, ie. group or other values

    // convert fgcs into a collapsed state

    // use functions to expand fgcs

    //compare original GraphologyAbstractGraph to fgcs.
    return graph
}

export {}
describe('testing group expansion', () => {

    // test('empty string should result in zero', () => {
    //     expect(expand().nodes()).toHaveLength(100)
    // });
});