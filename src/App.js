import React, { Component } from 'react';

import HBarChart from './components/HBarChart';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <HBarChart />
        </header>
      </div>
    );
  }
}

export default App;
