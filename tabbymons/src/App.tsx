import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Pokedex } from './pokeapi-js-wrapper';

function App() {
  const Pokedex = require("pokeapi-js-wrapper")
  const P = new Pokedex.Pokedex()
  
  P.getPokemonByName("eevee")
  .then((response: any) => {
    console.log(response)
  })

  return (
    
    
    <div className="App">
      <header className="App-header">
        <img src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"} className="App-logo" alt="logo" />

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
