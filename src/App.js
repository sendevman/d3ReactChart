import React, { Component } from 'react';

import HBarChart from './components/HBarChart';
import './App.css';
import data from './data.tsv';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <HBarChart data={data} />
        </header>
      </div>
    );
  }
}

export default App;
