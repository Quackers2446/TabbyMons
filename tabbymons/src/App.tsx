import React from "react";
import logo from "./logo.svg";
import "./App.css";
import internal from "stream";
import { array, string } from "zod";
import * as Pokedex from "pokeapi-js-wrapper";
import spawnRates from './spawnRatesSV.json';
import "./fonts/PKMN RBYGSC.ttf";
import ShinySVStar from "./images/ShinySVStar.png";
import { Tile, Select, SelectItem, SelectItemGroup } from "carbon-components-react";

function getRandNum(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

async function updateStorage(pokedexNumber: number, shinyChance: number, shinyRate: number) {
  if (!localStorage.getItem("localDex")) {
    let dex: { [key: number]: any } = {};
    for (let i = 1; i <= 1008; i++) dex[i] = { Encounters: 0, Shiny: 0 };
    localStorage.setItem("localDex", JSON.stringify(dex));
  }

  let tempLocalDex = localStorage.getItem("localDex");
  if (tempLocalDex) {
    if (tempLocalDex.length <= 32500) {
      let localDex = JSON.parse(tempLocalDex);
      for (let i = 906; i <= 1008; i++) localDex[i] = { Encounters: 0, Shiny: 0 };
      localStorage.setItem("localDex", JSON.stringify(localDex));
    }
    else {
      let localDex = JSON.parse(tempLocalDex);
      localDex[pokedexNumber].Encounters += 1;
      if (shinyChance == shinyRate) localDex[pokedexNumber].Shiny += 1;
      localStorage.setItem("localDex", JSON.stringify(localDex));
    }
  }
}

function determineHabitat() { }

function determineSpawn(): number {
  const rarity = getRandNum(1, 100);
  let pokeID = 0;

  if (rarity >= 99) {
    pokeID = spawnRates[4][getRandNum(0, spawnRates[4].length - 1)];
  } else if (rarity >= 90) {
    pokeID = spawnRates[3][getRandNum(0, spawnRates[3].length - 1)];
  } else if (rarity >= 75) {
    pokeID = spawnRates[2][getRandNum(0, spawnRates[2].length - 1)];
  } else if (rarity >= 50) {
    pokeID = spawnRates[1][getRandNum(0, spawnRates[1].length - 1)];
  } else {
    pokeID = spawnRates[0][getRandNum(0, spawnRates[0].length - 1)];
  }

  return pokeID;
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

  for (let i = 1; i <= 1008; i++) {
    const pokemon: any = await P.getPokemonByName(i);
    let baseStatTotal = pokemon.stats[0].base_stat + pokemon.stats[1].base_stat + pokemon.stats[2].base_stat +
      pokemon.stats[3].base_stat + pokemon.stats[4].base_stat + pokemon.stats[5].base_stat;

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

    console.log(i);
  }

  localDex[0] = common;
  localDex[1] = uncommon;
  localDex[2] = rare;
  localDex[3] = ultraRare;
  localDex[4] = secretRare;

  return localDex;
}

function App() {
  const customOptions = {
    cacheImages: true
  }

  const P = new Pokedex.Pokedex(customOptions);
  const [flavortext, setFlavortext] = React.useState<string>()
  const [flavorpokename, setFlavorpokename] = React.useState<string>()
  let [image, setImage] = React.useState<string>()
  let [ShinyStar, SetShinyStar] = React.useState<string>()

  //TODO: Different rates for rarer pokemon.
  //IDEA: Can set spawns to different reigons. We could even do different routes like in a pokemon game.
  //extension: Spawns can even be correlated to time of day. i.e. Solrock in day, lunatone at night.

  React.useEffect(() => {
    const pokedexNumber = determineSpawn(); // Currently 905 Pokemon in Pokedex; update when new generations come out.
    const shinyRate = 20; // Shiny rate. It's currently set lower for fun.
    const shinyChance = getRandNum(1, shinyRate);

    // const pokedexNumber = getRandNum(905, 1008);
    // const pokedexNumber = determineForm(pokeNumber.toString());

    // (async () => {
    //   let spawnRates = await createSpawn();
    //   console.log(JSON.stringify(spawnRates));
    // })();

    let pokemonImage =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

    if (shinyChance == shinyRate) {
      pokemonImage += "shiny/" + pokedexNumber + ".png";
      SetShinyStar(ShinySVStar);
    } else {
      pokemonImage += pokedexNumber + ".png";
      SetShinyStar(" ");
    }

    updateStorage(pokedexNumber, shinyChance, shinyRate);

    setImage(pokemonImage);

    flavorText(pokedexNumber).then((text) => {
      setFlavortext(text);
    });

    flavorPokeName(pokedexNumber).then((text) => {
      setFlavorpokename(text)
    })
  }, []);

  return (
    <div className="App-header">
      {/* <Select
        id="select-1"
        defaultValue="placeholder-item"
        labelText="Select an option"
        helperText="Optional helper text">
        <SelectItem
          disabled
          hidden
          value="placeholder-item"
          text="Choose an option"
        />
        <SelectItemGroup label="Category 1">
          <SelectItem value="option-1" text="Option 1" />
          <SelectItem value="option-2" text="Option 2" />
        </SelectItemGroup>
        <SelectItemGroup label="Category 2">
          <SelectItem value="option-3" text="Option 3" />
          <SelectItem value="option-4" text="Option 4" />
        </SelectItemGroup>
      </Select> */}

      <img
        src={image}
        className="Pokemon-Image"
        style={{ width: "auto", height: "auto" }}
        alt=""
      />
      <p className="name-container">

        <img src={ShinyStar} alt="" />

        &nbsp;{flavorpokename}
      </p>

      <p className="PokeInfo-container"> {flavortext}</p>
    </div>
  );
}

export default App;
