import React from "react";
import logo from "./logo.svg";
import "./App.css";
import internal from "stream";
import { string } from "zod";
import * as Pokedex from "pokeapi-js-wrapper";

function getRandNum(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

async function toLocalDex(): Promise<Record<string, any>> {
  const P = new Pokedex.Pokedex();
  let localDex: Record<string, any> = {};

  for (let i = 1; i <= 905; i++) {
    const pokemon: any = await P.getPokemonSpeciesByName(i);

    if (pokemon) {
      if (pokemon.habitat) {
        if (!(pokemon.habitat.name in localDex))
          localDex[pokemon.habitat.name as string] = [];
        localDex[pokemon.habitat.name as string].push(i);
      } else if (pokemon.evolves_from_species) {
        let poke: any = await P.getPokemonByName(
          pokemon.evolves_from_species.name
        );
        if (poke.habitat) {
          if (!(poke.habitat.name in localDex))
            localDex[poke.habitat.name as string] = [];
          localDex[poke.habitat.name as string].push(i);
        } else if (poke.evolves_from_species) {
          let poke2: any = await P.getPokemonByName(
            poke.evolves_from_species.name
          );
          if (poke2.habitat) {
            if (!(poke2.habitat.name in localDex))
              localDex[poke2.habitat.name as string] = [];
            localDex[poke2.habitat.name as string].push(i);
          } else {
            if (!("Does Not Spawn" in localDex))
              localDex["Does Not Spawn" as string] = [];
            localDex["Does Not Spawn"].push(i);
          }
        } else {
          if (!("Does Not Spawn" in localDex))
            localDex["Does Not Spawn" as string] = [];
          localDex["Does Not Spawn"].push(i);
        }
      }
    } else {
      if (!("Does Not Spawn" in localDex))
        localDex["Does Not Spawn" as string] = [];
      localDex["Does Not Spawn"].push(i);
    }
  }
  return localDex;
}

function App() {
  React.useEffect(() => {
    (async () => {
      let localDex = await toLocalDex();
      console.log(JSON.stringify(localDex));
    })();
  }, []);

  // P.getPokemonByName("eevee")
  // .then((response: any) => {
  //   console.log(response)
  // })

  const pokedexNumber = getRandNum(1, 905);
  const image =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
    pokedexNumber +
    ".png";
  console.log(image);

  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="App-logo" alt="logo" />

        <p>Welcome to TabbyMons</p>

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
