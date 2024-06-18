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

import { Fade } from '@carbon/icons-react'
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
    if (!collectNum || !shinyCollectNum) {
        localStorage.setItem("num", '0');
        localStorage.setItem("shinyNum", '0');
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
            shinyCollectNum = (Number(shinyCollectNum) + 1).toString();
            localDex[pokedexNumber].Shiny++;
        }
        collectNum = (Number(collectNum) + 1).toString();
        localDex[pokedexNumber].Encounters++;

        localStorage.setItem("localDex", JSON.stringify(localDex));
        localStorage.setItem("num", collectNum);
        localStorage.setItem("shinyNum", shinyCollectNum);
    }

    return [collectNum, shinyCollectNum];

    // if (!localStorage.getItem("localDex")) {
    // let dex: { [key: number]: any } = {};

    // for (let i = 1; i <= 1025; i++) dex[i] = { Encounters: 0, Shiny: 0 };
    // localStorage.setItem("localDex", JSON.stringify(dex));

    // console.log("RECREATE")
    // }

    // let dexNum: { [key: number]: any } = {};
    // let shinyDexNum: { [key: number]: any } = {};

    // let tempdexthing = localStorage.getItem("localDex");
    // if (tempdexthing) {
    //     let tempdex = JSON.parse(tempdexthing);
    //     for (let i = 1; i <= 1025; i++) {
    //         if (i <= tempdex.lenth - 1) {
    //             if (tempdex[i].Encounters > 0)
    //                 dexNum[i] = { Encounters: 1 };
    //             else
    //                 dexNum[i] = { Encounters: 0 };

    //             if (tempdex[i].Shiny > 0)
    //                 shinyDexNum[i] = { Shiny: 1 };
    //             else
    //                 shinyDexNum[i] = { Shiny: 0 };
    //         }
    //         else {
    //             tempdex[i] = { Encounters: 0 };
    //             dexNum[i] = { Encounters: 0 };
    //             shinyDexNum[i] = { Shiny: 0 };
    //         }

    //     }
    // }
    // // console.log(tempdexthing)
    // // console.log(dexNum, shinyDexNum)

    // localStorage.setItem("collectionNumber", JSON.stringify(dexNum));
    // localStorage.setItem("shinyCollectionNumber", JSON.stringify(shinyDexNum));

    // let collectionNumber = localStorage.getItem("collectionNumber");
    // let shinyCollectionNumber = localStorage.getItem("shinyCollectionNumber");

    // // if (!localStorage.getItem("localFormsDex")) {
    // //     let dex: { [key: number]: any } = {};
    // //     for (let i = 1; i <= 263; i++) dex[i] = { Encounters: 0, Shiny: 0 };
    // //     localStorage.setItem("localFormsDex", JSON.stringify(dex));
    // // }

    // let tempLocalDex = localStorage.getItem("localDex");
    // // let tempLocalFormsDex = localStorage.getItem("localFormsDex");

    // if (tempLocalDex) {
    //     // if (tempLocalDex.length <= 32500) {
    //     //     let localDex = JSON.parse(tempLocalDex);
    //     //     for (let i = 906; i <= 1008; i++)
    //     //         localDex[i] = { Encounters: 0, Shiny: 0 };
    //     //     localStorage.setItem("localDex", JSON.stringify(localDex));
    //     // } else {
    //     //     if (pokedexNumber <= 10000) {
    //     let localDex = JSON.parse(tempLocalDex);

    //     localDex[pokedexNumber].Encounters += 1;

    //     if (localDex[pokedexNumber].Encounters == 0) {
    //         collectionNumber = JSON.stringify(Number(collectionNumber) + 1);
    //     }

    //     if (localDex[pokedexNumber].Shiny == 0) {
    //         shinyCollectionNumber = JSON.stringify(
    //             Number(shinyCollectionNumber) + 1
    //         );
    //     }

    //     // console.log(localDex[pokedexNumber].Encounters);

    //     if (shinyChance == shinyRate) localDex[pokedexNumber].Shiny += 1;
    //     localStorage.setItem("localDex", JSON.stringify(localDex));
    //     // }
    //     // else {
    //     //     if (tempLocalFormsDex) {
    //     //         let localFormsDex = JSON.parse(tempLocalFormsDex);
    //     //         localFormsDex[pokedexNumber].Encounters += 1;
    //     //         if (shinyChance == shinyRate) localFormsDex[pokedexNumber].Shiny += 1;
    //     //         localStorage.setItem("localFormsDex", JSON.stringify(localFormsDex));
    //     //     }
    // }
    // // }
    // // }
    // console.log(collectionNumber);

    // return collectionNumber;

}

async function updateCollection(): Promise<[string, string]> {
    let num = 0;
    let shinyNum = 0;

    let collectNum = localStorage.getItem("collectionNumber");
    let shinyCollectNum = localStorage.getItem("shinyCollectionNumber");
    if (collectNum && shinyCollectNum) {
        let collectionNumber = JSON.parse(collectNum);
        let shinyCollectionNumber = JSON.parse(shinyCollectNum);
        for (let i = 1; i <= 1025; i++) {
            if (collectionNumber[i].Encounters > 0) {
                num += 1;
            }
            if (shinyCollectionNumber[i].Shiny > 0) {
                shinyNum += 1;
            }
        }
    }

    console.log(
        "Collection: " +
        num +
        "/1008. " +
        (num / 10.08).toFixed(1) +
        "%" +
        " Shiny Collection: " +
        shinyNum +
        "/1008. " +
        (shinyNum / 10.08).toFixed(1) +
        "%"
    );
    return [num.toString(), shinyNum.toString()];
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

    // console.log(pokemon.varieties);

    const rarity = getRandNum(0, 1);

    // if (pokemon.forms_switchable) {
    //   return pokeName;
    // }

    const pokeIDName = pokemon.varieties[rarity].name;

    const pokemon2: any = await P.getPokemonByName(pokeIDName);

    return pokemon2.id;
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

    pokemon.configure({ apiKey: '4242ea42-4d17-4a53-894f-cb556f844c78' })

    const cards: any = await pokemon.card.where({ q: `name:${currentMon.name}` })
        .then((result: any) => {
            console.log(result)
            return result;
        })
    return cards;
}

async function flavorPokeName(pokeID: number, P: any): Promise<string> {
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
    for (let i = 1; i <= 1025; i++) {
        console.log(i);
        const pokemon: any = await P.getPokemonByName(i);
        let baseStatTotal =
            pokemon.stats[0].base_stat +
            pokemon.stats[1].base_stat +
            pokemon.stats[2].base_stat +
            pokemon.stats[3].base_stat +
            pokemon.stats[4].base_stat +
            pokemon.stats[5].base_stat;

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

    }
    for (let i = 10001; i <= 10277; i++) {
        const pokemon: any = await P.getPokemonByName(i);
        let baseStatTotal =
            pokemon.stats[0].base_stat +
            pokemon.stats[1].base_stat +
            pokemon.stats[2].base_stat +
            pokemon.stats[3].base_stat +
            pokemon.stats[4].base_stat +
            pokemon.stats[5].base_stat;

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

        // console.log(i);
    }

    localDex[0] = common;
    localDex[1] = uncommon;
    localDex[2] = rare;
    localDex[3] = ultraRare;
    localDex[4] = secretRare;

    console.log(localDex);
    return localDex;
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
    const [heldItem, setHeldItem] = React.useState<string>();
    const [ShinyStar, SetShinyStar] = React.useState<string>();
    const [collectionNum, SetCollectionNum] = React.useState<(string | null)[]>();
    const [cardImage, setCardImage] = React.useState<any>();
    const [pokedex, setPokedex] = React.useState<any>();

    //IDEA: Can set spawns to different reigons. We could even do different routes like in a pokemon game.
    //extension: Spawns can even be correlated to time of day. i.e. Solrock in day, lunatone at night.

    React.useEffect(() => {
        const customOptions = {
            cacheImages: true,
        };

        const P = new Pokedex.Pokedex(customOptions);

        const spawn = determineSpawn();
        const pokedexNumber = spawn[0];
        const shinyRate = 5; // Shiny rate. It's currently set lower for fun.
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

        SetRarityColor(spawn[1]);

        getPokemonType(pokedexNumber, P).then((text) => {
            setPokemonType(text);
        });

        getHeldItem(pokedexNumber, P).then((text) => {
            setHeldItem(text);
        });

        flavorText(pokedexNumber, P).then((text) => {
            setFlavortext(text);
        });

        flavorPokeName(pokedexNumber, P).then((text) => {
            setFlavorpokename(text);
        });

        fetchCard(pokedexNumber, P).then((text) => {
            setCardImage(text);
        });

        setTimeout(function () {
            updateStorage(pokedexNumber, shinyChance, shinyRate).then((text) => {
                SetCollectionNum(text);
            });
        }, 200);

        setPokedex(localStorage.getItem("localDex"));

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
                    <carbon.Toggle labelA="TCG" labelB="PNG" defaultToggled id="toggle-1" />
                    {pokedex && <PokedexComponent Pokedex={pokedex} />}
                </carbon.Header>
                {cardImage ?
                    <>
                        {console.log(cardImage)}
                        <img src={cardImage.data[getRandNum(0, cardImage.data.length - 1)].images.large} className="Pokemon-Image" alt="" />
                        <br />
                    </> :
                    <img src={image} className="Pokemon-Image" alt="" />
                }
                <p className="name-container" style={{ color: raritycolor }}>
                    <div className="type-container">
                        {heldItem && <img src={heldItem} alt="" />}
                        &nbsp;
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
