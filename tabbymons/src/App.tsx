import React from 'react';
import logo from './logo.svg';
import './App.css';
import internal from 'stream';

function getRandNum(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function App() {
  const Pokedex = require("pokeapi-js-wrapper")
  const P = new Pokedex.Pokedex()
  
  P.getPokemonByName("eevee")
  .then((response: any) => {
    console.log(response)
  })

  const pokedexNumber = getRandNum(1, 905);
  const image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + pokedexNumber + ".png";
  console.log(image);

  return (
    
    
    <div className="App">
      <header className="App-header">
        <img src={image} className="App-logo" alt="logo" />

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
