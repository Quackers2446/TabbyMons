import React from "react";
import * as carbon from '@carbon/react'
import { Fade } from '@carbon/icons-react'

interface PokedexProps {
    Pokedex: string;
}

export const PokedexComponent: React.FC<PokedexProps> = (props: PokedexProps) => {
    const { Pokedex } = props;
    const [isSideNavExpanded, setIsSideNavExpanded] = React.useState<boolean>(false);
    const PokedexObj = JSON.parse(Pokedex);

    const chunkArray = (array: number[], size: number) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const pokemonIds = Object.keys(PokedexObj).map((key) => Number(key));
    const kanto = chunkArray(pokemonIds.slice(0, 151), 3);
    const johto = chunkArray(pokemonIds.slice(151, 251), 3);
    const hoenn = chunkArray(pokemonIds.slice(251, 386), 3);
    const sinnoh = chunkArray(pokemonIds.slice(386, 493), 3);
    const unova = chunkArray(pokemonIds.slice(493, 649), 3);
    const kalos = chunkArray(pokemonIds.slice(649, 721), 3);
    const alola = chunkArray(pokemonIds.slice(721, 809), 3);
    const galar = chunkArray(pokemonIds.slice(809, 905), 3);
    const paldea = chunkArray(pokemonIds.slice(809, 1025), 3);

    const regions = [
        { name: 'Kanto', data: kanto },
        { name: 'Johto', data: johto },
        { name: 'Hoenn', data: hoenn },
        { name: 'Sinnoh', data: sinnoh },
        { name: 'Unova', data: unova },
        { name: 'Kalos', data: kalos },
        { name: 'Alola', data: alola },
        { name: 'Galar', data: galar },
        { name: 'Paldea', data: paldea },
    ];

    return (
        <carbon.SideNav aria-label="Side navigation" expanded={isSideNavExpanded} onOverlayClick={() => setIsSideNavExpanded(!isSideNavExpanded)} href="#main-content" isRail>
            {
                <carbon.SideNavItems>
                    {regions.map(reigon => (
                        <carbon.SideNavMenu renderIcon={Fade} title={reigon.name} className={"sidenav-container"} >
                            <br></br>
                            {
                                reigon.data.map((chunk, index) => (
                                    <carbon.Grid key={index} className="grid-container">
                                        {chunk.map((id) => (
                                            <carbon.Column key={id}>
                                                <img
                                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                                    alt={`Pokemon ${id}`}
                                                />
                                            </carbon.Column>
                                        ))}
                                    </carbon.Grid>
                                ))
                            }
                        </carbon.SideNavMenu>
                    ))}
                </carbon.SideNavItems>
            }
        </carbon.SideNav >
    );
};
