import * as Pokedex from "pokeapi-js-wrapper";

export async function createSpawn(): Promise<Record<string, any>> {
    let common: Array<number> = [];
    let uncommon: Array<number> = [];
    let rare: Array<number> = [];
    let ultraRare: Array<number> = []; // pseudo-legendaries
    let secretRare: Array<number> = []; // legendaries / mythicals

    const P = new Pokedex.Pokedex();
    let localDex: Record<string, any> = {};
    for (let i = 1; i <= 1025; i++) {
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

    return localDex;
}

console.log(createSpawn())