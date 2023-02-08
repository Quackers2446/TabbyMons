import bugIcon from "./images/Bug_icon_SwSh.png";
import darkIcon from "./images/Dark_icon_SwSh.png";
import dragonIcon from "./images/Dragon_icon_SwSh.png";
import electricIcon from "./images/Electric_icon_SwSh.png";
import fairyIcon from "./images/Fairy_icon_SwSh.png";
import fightingIcon from "./images/Fighting_icon_SwSh.png";
import fireIcon from "./images/Fire_icon_SwSh.png";
import flyingIcon from "./images/Flying_icon_SwSh.png";
import ghostIcon from "./images/Ghost_icon_SwSh.png";
import grassIcon from "./images/Grass_icon_SwSh.png";
import groundIcon from "./images/Ground_icon_SwSh.png";
import iceIcon from "./images/Ice_icon_SwSh.png";
import normalIcon from "./images/Normal_icon_SwSh.png";
import poisonIcon from "./images/Poison_icon_SwSh.png";
import psychicIcon from "./images/Psychic_icon_SwSh.png";
import rockIcon from "./images/Rock_icon_SwSh.png";
import steelIcon from "./images/Steel_icon_SwSh.png";
import waterIcon from "./images/Water_icon_SwSh.png";

const images: { [key: string]: string } = {
    bug: bugIcon,
    dark: darkIcon,
    dragon: dragonIcon,
    electric: electricIcon,
    fairy: fairyIcon,
    fighting: fightingIcon,
    fire: fireIcon,
    flying: flyingIcon,
    ghost: ghostIcon,
    grass: grassIcon,
    ground: groundIcon,
    ice: iceIcon,
    normal: normalIcon,
    poison: poisonIcon,
    psychic: psychicIcon,
    rock: rockIcon,
    steel: steelIcon,
    water: waterIcon
}

export const TypeIcons: React.FunctionComponent<{ image: string }> = ({ image }) => {
    return <img src={images[image]} />
}
