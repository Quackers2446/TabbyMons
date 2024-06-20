import React from "react";
import "./vendor.scss";
import "./App.scss";
import * as Pokedex from "pokeapi-js-wrapper";
import { PokedexComponent } from "./components/Pokedex";
import spawnRates from "./tools/spawnRates.json";
import spawnRatesForms from "./tools/spawnRatesForms.json";
import "./fonts/PKMN RBYGSC.ttf";
import ShinySVStar from "./images/ShinySVStar.png";
import { TypeIcons } from "./typeIcons";
import pokemon from 'pokemontcgsdk'

import * as carbon from "@carbon/react";

const numPokemon = 1025;

function getRandNum(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

async function updateStorage(
    pokedexNumber: number,
    shinyChance: number,
    shinyRate: number
) {
    let localDexStr = localStorage.getItem("localDex");
    if (!localDexStr) {
        let dex: { [key: number]: any } = {};

        for (let i = 1; i <= numPokemon; i++) dex[i] = { Encounters: 0, Shiny: 0 };
        localStorage.setItem("localDex", JSON.stringify(dex));
    }

    let collectNum = localStorage.getItem("num");
    let shinyCollectNum = localStorage.getItem("shinyNum");
    // if (!collectNum || !shinyCollectNum) {
    let tempDexStr = localStorage.getItem("localDex");
    if (tempDexStr) {
        const tempDex = JSON.parse(tempDexStr);
        let num = 0;
        let shinyNum = 0;

        for (let i = 1; i <= numPokemon; i++) {
            if (!(i in tempDex)) {
                tempDex[i] = { Encounters: 0, Shiny: 0 }
            }
            if (tempDex[i].Encounters > 0)
                num++
            if (tempDex[i].Shiny > 0)
                shinyNum++
        };

        localStorage.setItem("tempDex", JSON.stringify(tempDex));
        localStorage.setItem("num", num.toString());
        localStorage.setItem("shinyNum", shinyNum.toString());
    }

    localDexStr = localStorage.getItem("localDex");
    collectNum = localStorage.getItem("num");
    shinyCollectNum = localStorage.getItem("shinyNum");

    if (localDexStr && collectNum && shinyCollectNum) {
        let localDex = JSON.parse(localDexStr);
        if (pokedexNumber > Object.keys(localDex).length - 1) {
            localDex[pokedexNumber] = { Encounters: 0, Shiny: 0 }
        }

        if (shinyChance === shinyRate) {
            if (localDex[pokedexNumber].Shiny == 0)
                shinyCollectNum = (Number(shinyCollectNum) + 1).toString();
            localDex[pokedexNumber].Shiny++;
        }
        if (localDex[pokedexNumber].Encounters == 0)
            collectNum = (Number(collectNum) + 1).toString();
        localDex[pokedexNumber].Encounters++;

        localStorage.setItem("localDex", JSON.stringify(localDex));
        localStorage.setItem("num", collectNum);
        localStorage.setItem("shinyNum", shinyCollectNum);
    }

    return [collectNum, shinyCollectNum];
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

async function flavorText(pokeID: number, P: any): Promise<string> {
    const pokemon: any = await P.getPokemonSpeciesByName(pokeID);
    try {
        for (let i = 0; i < pokemon.flavor_text_entries.length; i++) {
            if (pokemon.flavor_text_entries[i].language.name == "en") {
                return pokemon.flavor_text_entries[i].flavor_text;
            }
        }

        return pokemon.flavor_text_entries[0].flavor_text;
    } catch (e) {
        return "Full Pokédex entries coming soon™";
    }
}

async function fetchCard(pokeID: number, P: any): Promise<any> {
    const currentMon: any = await P.getPokemonByName(pokeID);

    pokemon.configure({ apiKey: process.env.POKEMONTCG_API_KEY })

    const cards: any = await pokemon.card.where({ q: `name:${currentMon.name.split("-")[0]}` })
        .then((result: any) => {
            return result;
        })
    return cards.data ? cards.data[getRandNum(0, cards.data.length - 1)].images.large : '';
}

async function flavorPokeName(pokeID: number, P: any): Promise<string> {
    const pokemon: any = await P.getPokemonByName(pokeID);

    return pokemon.name;
}

async function getPokemonType(pokeID: number, P: any): Promise<[string, string]> {
    const pokemon: any = await P.getPokemonByName(pokeID);

    if (pokemon.types[1] != null) {
        // console.log([pokemon.types[0].type.name, pokemon.types[1].type.name]);
        return [pokemon.types[0].type.name, pokemon.types[1].type.name];
    } else {
        // console.log([pokemon.types[0].type.name]);
        return [pokemon.types[0].type.name, ""];
    }
}

async function getHeldItem(pokeID: number, P: any): Promise<string> {
    const pokemon: any = await P.getPokemonByName(pokeID);

    const heldItemChance = getRandNum(1, 5);
    // placeholder 20%, have yet to implement held item rarity

    if (pokemon.held_items.length > 0 && heldItemChance == 1) {
        const rand = getRandNum(0, pokemon.held_items.length - 1);
        // console.log(pokemon.held_items[rand].item.name);

        const item: any = await P.getItemByName(pokemon.held_items[rand].item.name);
        // console.log(item.sprites["default"]);
        return item.sprites["default"];
    }
    return "";
}

function App() {
    const [flavortext, setFlavortext] = React.useState<string>();
    const [flavorpokename, setFlavorpokename] = React.useState<string>();
    const [pokemonType, setPokemonType] = React.useState<[string, string]>();
    const [raritycolor, SetRarityColor] = React.useState<string>();
    const [image, setImage] = React.useState<string>();
    // const [heldItem, setHeldItem] = React.useState<string>();
    const [ShinyStar, SetShinyStar] = React.useState<string>();
    const [collectionNum, SetCollectionNum] = React.useState<(string | null)[]>();
    const [cardImage, setCardImage] = React.useState<any>();
    const [pokedex, setPokedex] = React.useState<any>();
    const [isTCG, setIsTCG] = React.useState<boolean>(localStorage && localStorage.getItem("isTCG") == "true");

    //IDEA: Can set spawns to different reigons. We could even do different routes like in a pokemon game.
    //extension: Spawns can even be correlated to time of day. i.e. Solrock in day, lunatone at night.

    React.useEffect(() => {
        const customOptions = {
            cacheImages: true,
        };

        const P = new Pokedex.Pokedex(customOptions);

        const spawn = determineSpawn();
        const pokedexNumber = spawn[0];
        const shinyRate = 20; // Shiny rate. It's currently set lower for fun.
        const shinyChance = getRandNum(1, shinyRate);

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

        fetchCard(pokedexNumber, P).then((text) => {
            setCardImage(text);
        });

        SetRarityColor(spawn[1]);

        getPokemonType(pokedexNumber, P).then((text) => {
            setPokemonType(text);
        });

        // getHeldItem(pokedexNumber, P).then((text) => {
        //     setHeldItem(text);
        // });

        flavorText(pokedexNumber, P).then((text) => {
            setFlavortext(text);
        });

        flavorPokeName(pokedexNumber, P).then((text) => {
            setFlavorpokename(text);
        });

        setTimeout(function () {
            updateStorage(pokedexNumber, shinyChance, shinyRate).then((text) => {
                SetCollectionNum(text);
            });
        }, 200);

        setPokedex(localStorage.getItem("localDex"));

        let testIsTCG = localStorage.getItem("isTCG");
        if (!testIsTCG) {
            setIsTCG(false);
            localStorage.setItem("isTCG", String(isTCG));
        } else {
            setIsTCG(testIsTCG == "true");
            localStorage.setItem("isTCG", String(isTCG));
        }
    }, []);

    return (
        <carbon.Theme theme="g90">
            <div className="App-header">
                <carbon.Header aria-label="Tabbymons Platform Name">
                    <carbon.HeaderName prefix="">
                        {collectionNum && collectionNum[0]} / {numPokemon}
                    </carbon.HeaderName>
                    <carbon.HeaderName prefix="">
                        {collectionNum && collectionNum[1]} / {numPokemon}
                    </carbon.HeaderName>
                    <carbon.Toggle labelA="TCG" labelB="PNG" id="toggle-1" onClick={() => {
                        localStorage.setItem("isTCG", String(!isTCG));
                        setIsTCG(!isTCG);
                    }} toggled={!isTCG} />
                    {/* {pokedex && <PokedexComponent Pokedex={pokedex} />} */}
                </carbon.Header>
                {isTCG ?
                    cardImage ?
                        <>
                            <img src={cardImage} className="Pokemon-Image" alt="" />
                            <br />
                        </> : <><carbon.SkeletonPlaceholder className="placeholder" /><br /></>
                    :
                    <img src={image} className="Pokemon-Image" alt="" />
                }
                {/* {isTCG ?
                    <div className="flip-container">
                        <div className="flipper">
                            <img src="https://archives.bulbagarden.net/media/upload/1/17/Cardback.jpg" alt="Front Image" className="front" />
                            <img src={cardImage} alt="Back Image" className="back" />
                        </div>
                    </div>
                    :
                    <img src={image} className="Pokemon-Image" alt="" />
                } */}
                <p className="name-container" style={{ color: raritycolor }}>
                    <div className="type-container">
                        {/* {heldItem && <img src={heldItem} alt="" />}
                        &nbsp; */}
                        {ShinyStar && <img src={ShinyStar} alt="" />}
                        &nbsp;{flavorpokename} &nbsp;
                        {pokemonType?.[0] && <TypeIcons image={pokemonType[0]} />}
                        &nbsp;
                        {pokemonType?.[1] && <TypeIcons image={pokemonType[1]} />}
                    </div>
                </p>
                <p className="PokeInfo-container"> {flavortext}</p>
            </div>
        </carbon.Theme >
    );
}

export default App;
