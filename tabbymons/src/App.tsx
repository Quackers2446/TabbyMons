import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Pokedex from "./pokeapi-js-wrapper/index.js";

function App() {
  return (
    
    
    <div className="App">
      <header className="App-header">
        <img src={"https://archives.bulbagarden.net/media/upload/thumb/5/53/054Psyduck.png/1200px-054Psyduck.png"} className="App-logo" alt="logo" />

        <p>
          Welcome to TabbyMons
        </p>

        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
