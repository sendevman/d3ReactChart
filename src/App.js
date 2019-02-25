import React, { Component } from 'react';

import HBarChart from './components/HBarChart';
import RidgelineChart from './components/RidgelineChart';
import AdditionalRidgelineChart from './components/AdditionalRidgelineChart';
import SlopegraphChart from './components/SlopegraphChart';
import './App.css';
import tdata from './data.tsv';
import cdata from './data.csv';
import sdata from './sdata.csv';
import rdata from './ridgelineData.json';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <HBarChart data={tdata} />
          <RidgelineChart data={cdata} />
          <SlopegraphChart data={sdata} />
          <AdditionalRidgelineChart data={rdata} />
        </header>
      </div>
    );
  }
}

export default App;
