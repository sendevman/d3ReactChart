import React, { Component } from 'react';

import HBarChart from './components/HBarChart';
import RidgelineChart from './components/RidgelineChart';
import './App.css';
import tdata from './data.tsv';
import cdata from './data.csv';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <HBarChart data={tdata} />
          <RidgelineChart data={cdata} />
        </header>
      </div>
    );
  }
}

export default App;
