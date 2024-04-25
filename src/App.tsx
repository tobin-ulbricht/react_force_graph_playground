'use client'

import React, {lazy, useRef} from 'react';
import {GraphProvider} from './providers/GraphContextProvider';
// import logo from './logo.svg';
import './App.css';

const Graph = lazy(() => import('./graph/page'))

function App() {
  const fgRef = useRef<any | null>();

  return (
      <main className="flex min-h-screen flex-col p-6" suppressHydrationWarning>
        <div className="flex min-h-80 shrink-0 items-end rounded-lg bg-blue-500 p-4">
        </div>
        <GraphProvider>
          <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
            <div
                className="flex-none flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/5 md:px-20">
              {/*<GraphDataSelector/>*/}
              {/*<GraphDataDownload/>*/}
            </div>
            <div className="flex border-8 border-slate-500 rounded-lg md:w-3/5">
              <div id="graph"/>
              <Graph/>
            </div>
            <div
                className="flex-none flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/5 md:px-20">
            </div>
          </div>
        </GraphProvider>
      </main>
  );
}

export default App;
