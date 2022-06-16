import React from 'react';
import './App.css';
import { Tasks } from './tasks/Tasks';

const tableContainerStyle = {
  paddingLeft: '40px',
  paddingRight: '40px',
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div style={tableContainerStyle}>
        <Tasks />
      </div>
    </div>
  );
}

export default App;
