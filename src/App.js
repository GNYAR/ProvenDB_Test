import logo from './logo.svg';
import './App.css';
import React from 'react';
import IdeasTable from './IdeasTable.jsx';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <IdeasTable />
      </header>
    </div>
  );
}

export default App;
