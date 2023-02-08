import React from "react";
import "./App.scss";
import "./vendor.scss"
import * as Pokedex from "pokeapi-js-wrapper";
import spawnRates from './spawnRatesSV.json';
import spawnRatesForms from './spawnRatesForms.json';
import "./fonts/PKMN RBYGSC.ttf";
import ShinySVStar from "./images/ShinySVStar.png";
import { TypeIcons } from "./typeIcons";
// @ts-ignore
// import { Toggle } from "@carbon/react";
import { assert } from "console";

function getRandNum(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

async function updateStorage(pokedexNumber: number, shinyChance: number, shinyRate: number) {
  if (!localStorage.getItem("localDex")) {
    let dex: { [key: number]: any } = {};
    for (let i = 1; i <= 1008; i++) dex[i] = { Encounters: 0, Shiny: 0 };
    localStorage.setItem("localDex", JSON.stringify(dex));
  }

  if (!localStorage.getItem("localFormsDex")) {
    let dex: { [key: number]: any } = {};
    for (let i = 1; i <= 263; i++) dex[i] = { Encounters: 0, Shiny: 0 };
    localStorage.setItem("localFormsDex", JSON.stringify(dex));
  }

  let tempLocalDex = localStorage.getItem("localDex");
  let tempLocalFormsDex = localStorage.getItem("localFormsDex");
  if (tempLocalDex) {
    if (tempLocalDex.length <= 32500) {
      let localDex = JSON.parse(tempLocalDex);
      for (let i = 906; i <= 1008; i++) localDex[i] = { Encounters: 0, Shiny: 0 };
      localStorage.setItem("localDex", JSON.stringify(localDex));
    }
    else {
      if (pokedexNumber <= 10000) {
        let localDex = JSON.parse(tempLocalDex);
        localDex[pokedexNumber].Encounters += 1;
        if (shinyChance == shinyRate) localDex[pokedexNumber].Shiny += 1;
        localStorage.setItem("localDex", JSON.stringify(localDex));
      } else {
        if (tempLocalFormsDex) {
          let localFormsDex = JSON.parse(tempLocalFormsDex);
          localFormsDex[pokedexNumber].Encounters += 1;
          if (shinyChance == shinyRate) localFormsDex[pokedexNumber].Shiny += 1;
          localStorage.setItem("localFormsDex", JSON.stringify(localFormsDex));
        }
      }
    }
  }
}

function determineSpawn(): [number, string] {
  const rarity = getRandNum(1, 100);
  let color = "";
  let pokeID = 0;

  if (rarity >= 99) {
    pokeID = spawnRates[4][getRandNum(0, spawnRates[4].length - 1)];
    color = "#FFD700";
  } else if (rarity >= 90) {
    pokeID = spawnRates[3][getRandNum(0, spawnRates[3].length - 1)];
    color = "#cc99ff";
  } else if (rarity >= 75) {
    pokeID = spawnRates[2][getRandNum(0, spawnRates[2].length - 1)];
    color = "#99ccff";
  } else if (rarity >= 50) {
    pokeID = spawnRates[1][getRandNum(0, spawnRates[1].length - 1)];
    color = "#ccffcc";
  } else {
    pokeID = spawnRates[0][getRandNum(0, spawnRates[0].length - 1)];
    color = "#ffffff";
  }

  return [pokeID, color];
}

async function determineForm(pokeName: string): Promise<number> {
  const P = new Pokedex.Pokedex();

  const pokemon: any = await P.getPokemonSpeciesByName(pokeName);

  console.log(pokemon.varieties);

  const rarity = getRandNum(0, 1);

  // if (pokemon.forms_switchable) {
  //   return pokeName;
  // }

  const pokeIDName = pokemon.varieties[rarity].name;

  const pokemon2: any = await P.getPokemonByName(pokeIDName);

  return pokemon2.id;
}

async function flavorText(pokeID: number): Promise<string> {
  const P = new Pokedex.Pokedex();

  const pokemon: any = await P.getPokemonSpeciesByName(pokeID);
  try {
    for (let i = 0; i < pokemon.flavor_text_entries.length; i++) {
      if (pokemon.flavor_text_entries[i].language.name == "en") {
        return pokemon.flavor_text_entries[i].flavor_text;
      }
    }

    return pokemon.flavor_text_entries[0].flavor_text;
  } catch (e) {
    return "Pokémon Scarlet & Violet:  Full Pokédex entries coming soon™";
  }
}

async function flavorPokeName(pokeID: number): Promise<string> {
  const P = new Pokedex.Pokedex();

  const pokemon: any = await P.getPokemonByName(pokeID);

  return pokemon.name;
}

async function createSpawn(): Promise<Record<string, any>> {
  let common: Array<number> = [];
  let uncommon: Array<number> = [];
  let rare: Array<number> = [];
  let ultraRare: Array<number> = []; // pseudo-legendaries
  let secretRare: Array<number> = []; // legendaries / mythicals

  const P = new Pokedex.Pokedex();
  let localDex: Record<string, any> = {};

  for (let i = 10001; i <= 10263; i++) {
    const pokemon: any = await P.getPokemonByName(i);
    let baseStatTotal = pokemon.stats[0].base_stat + pokemon.stats[1].base_stat + pokemon.stats[2].base_stat +
      pokemon.stats[3].base_stat + pokemon.stats[4].base_stat + pokemon.stats[5].base_stat;

    if (!pokemon.name.includes("mega")) {
      if (baseStatTotal >= 570) {
        secretRare.push(i);
      } else if (baseStatTotal >= 500) {
        ultraRare.push(i);
      } else if (baseStatTotal >= 405) {
        rare.push(i);
      } else if (baseStatTotal >= 300) {
        uncommon.push(i);
      } else {
        common.push(i);
      }
    }

    console.log(i);
  }

  localDex[0] = common;
  localDex[1] = uncommon;
  localDex[2] = rare;
  localDex[3] = ultraRare;
  localDex[4] = secretRare;

  return localDex;
}

async function getPokemonType(pokeID: number): Promise<[string, string]> {
  const P = new Pokedex.Pokedex();

  const pokemon: any = await P.getPokemonByName(pokeID);

  if (pokemon.types[1] != null) {
    console.log([pokemon.types[0].type.name, pokemon.types[1].type.name]);
    return [pokemon.types[0].type.name, pokemon.types[1].type.name];
  } else {
    console.log([pokemon.types[0].type.name]);
    return [pokemon.types[0].type.name, ""];
  }
}

function App() {
  const customOptions = {
    cacheImages: true
  }

  const P = new Pokedex.Pokedex(customOptions);
  const [flavortext, setFlavortext] = React.useState<string>()
  const [flavorpokename, setFlavorpokename] = React.useState<string>()
  const [pokemonType, setPokemonType] = React.useState<[string, string]>()
  const [raritycolor, SetRarityColor] = React.useState<string>()
  const [image, setImage] = React.useState<string>()
  const [ShinyStar, SetShinyStar] = React.useState<string>()


  //IDEA: Can set spawns to different reigons. We could even do different routes like in a pokemon game.
  //extension: Spawns can even be correlated to time of day. i.e. Solrock in day, lunatone at night.

  React.useEffect(() => {
    const spawn = determineSpawn(); // Currently 905 Pokemon in Pokedex; update when new generations come out.
    const pokedexNumber = spawn[0];
    const shinyRate = 20; // Shiny rate. It's currently set lower for fun.
    const shinyChance = getRandNum(1, shinyRate);
    const type = getPokemonType(pokedexNumber);

    let pokemonImage =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

    if (shinyChance == shinyRate) {
      pokemonImage += "shiny/" + pokedexNumber + ".png";
      SetShinyStar(ShinySVStar);
    } else {
      pokemonImage += pokedexNumber + ".png";
      SetShinyStar("");
    }

    setImage(pokemonImage);

    SetRarityColor(spawn[1]);

    getPokemonType(pokedexNumber).then((text) => {
      setPokemonType(text);
    })

    flavorText(pokedexNumber).then((text) => {
      setFlavortext(text);
    });

    flavorPokeName(pokedexNumber).then((text) => {
      setFlavorpokename(text)
    })

    setTimeout(function () {
      updateStorage(pokedexNumber, shinyChance, shinyRate);
      console.log("Executed after 200 ms");
    }, 200);
  }, []);

  return (
    <div className="App-header">
      <img
        src={image}
        className="Pokemon-Image"
        alt=""
      />
      <p className="name-container"
        style={{ color: raritycolor }}
      >
        <div className="type-container">
          {ShinyStar && <img src={ShinyStar} alt="" />}
          &nbsp;{flavorpokename}
          &nbsp;
          {pokemonType?.[0] && <TypeIcons image={pokemonType[0]} />}
          &nbsp;
          {pokemonType?.[1] && <TypeIcons image={pokemonType[1]} />}
        </div>
      </p>
      <p className="PokeInfo-container"> {flavortext}</p>
    </div >
  );
}

export default App;
