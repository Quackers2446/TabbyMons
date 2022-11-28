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
  
  P.getPokemonSpeciesByName(25).then(function(response: any) {
    console.log(response)
  })

  //TODO: Different rates for rarer pokemon. 
  //IDEA: Can set spawns to different reigons. We could even do different routes like in a pokemon game.
  //extension: Spawns can even be correlated to time of day. i.e. Solrock in day, lunatone at night.
  
  const pokedexNumber = getRandNum(1, 905); // Currently 905 Pokemon in Pokedex; update when new generations come out.
  const shinyChance = getRandNum(1,20); // Shiny rate. It's currently set lower for fun.

  let image =  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  
  if (shinyChance == 20) {
     image += "shiny/" + pokedexNumber + ".png";
  } else {
    image += pokedexNumber + ".png";
  }
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
