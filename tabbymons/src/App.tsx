import React from "react";
import logo from "./logo.svg";
import "./App.css";
import internal from "stream";
import { array, string } from "zod";
import * as Pokedex from "pokeapi-js-wrapper";
import "./fonts/PKMN RBYGSC.ttf";
import goldstar from "./images/goldstarTransparent2.png";
import { Tile } from "carbon-components-react";

function getRandNum(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function determineHabitat() { }

function determineSpawn() { }

async function flavorText(pokeID: number): Promise<string> {
  const P = new Pokedex.Pokedex();

  const pokemon: any = await P.getPokemonSpeciesByName(pokeID);

  for (let i = 0; i < pokemon.flavor_text_entries.length; i++) {
    if (pokemon.flavor_text_entries[i].language.name == "en") {
      // console.log(pokemon.names);
      return pokemon.flavor_text_entries[i].flavor_text;
    }
  }

  // console.log("No Index: " + 0);
  return pokemon.flavor_text_entries[0].flavor_text;
}

async function flavorPokeName(pokeID: number): Promise<string> {
  const P = new Pokedex.Pokedex();

  const pokemon: any = await P.getPokemonByName(pokeID);

  return pokemon.name;
}

function App() {
  const customOptions = {
    cacheImages: true
  }

  const P = new Pokedex.Pokedex(customOptions);
  const [flavortext, setFlavortext] = React.useState<string>()
  const [flavorpokename, setFlavorpokename] = React.useState<string>()
  let [image, setImage] = React.useState<string>()

  //TODO: Different rates for rarer pokemon.
  //IDEA: Can set spawns to different reigons. We could even do different routes like in a pokemon game.
  //extension: Spawns can even be correlated to time of day. i.e. Solrock in day, lunatone at night.

  React.useEffect(() => {
    const pokedexNumber = getRandNum(1, 905); // Currently 905 Pokemon in Pokedex; update when new generations come out.
    const shinyRate = 20; // Shiny rate. It's currently set lower for fun.
    const shinyChance = getRandNum(1, shinyRate);

    let pokemonImage =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

    if (shinyChance == shinyRate) {
      pokemonImage += "shiny/" + pokedexNumber + ".png";
    } else {
      pokemonImage += pokedexNumber + ".png";
    }

    setImage(pokemonImage);

    flavorText(pokedexNumber).then((text) => {
      setFlavortext(text);
    });

    if (!localStorage.getItem("localDex")) {
      let dex: { [key: number]: any } = {};
      for (let i = 1; i <= 905; i++) dex[i] = { Encounters: 0, Shiny: 0 };
      localStorage.setItem("localDex", JSON.stringify(dex));
    }

    let tempLocalDex = localStorage.getItem("localDex");
    if (tempLocalDex) {
      let localDex = JSON.parse(tempLocalDex);
      localDex[pokedexNumber].Encounters += 1;
      if (shinyChance == shinyRate) localDex[pokedexNumber].shiny += 1;
      localStorage.setItem("localDex", JSON.stringify(localDex));
    }

    flavorPokeName(pokedexNumber).then((text) => {
      setFlavorpokename(text)
    })

  }, []);

  return (
    <div className="App-header">
      <img
        src={image}
        className="App-logo"
        style={{ width: "auto", height: "auto" }}
        alt=""
      />
      <p className="name-container">
        {/* <img src={goldstar} alt="" />  */}
        {flavorpokename}</p>
      <p className="content-container"> {flavortext}</p>
      {/* <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a> */}


    </div>
  );
}

export default App;
