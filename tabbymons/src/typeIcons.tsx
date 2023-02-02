import darkIcon from "./images/Dark_icon__SwSh.png";
import dragonIcon from "./images/Dragon_icon__SwSh.png";
import electricIcon from "./images/Electric_icon__SwSh.png";
import fairyIcon from "./images/Fairy_icon__SwSh.png";
import fightingIcon from "./images/Fighting_icon__SwSh.png";
import fireIcon from "./images/Fire_icon__SwSh.png";
import flyingIcon from "./images/Flying_icon__SwSh.png";
import ghostIcon from "./images/Ghost_icon__SwSh.png";
import grassIcon from "./images/Grass_icon__SwSh.png";
import groundIcon from "./images/Ground_icon__SwSh.png";
import iceIcon from "./images/Ice_icon__SwSh.png";
import normalIcon from "./images/Normal_icon__SwSh.png";
import poisonIcon from "./images/Poison_icon__SwSh.png";
import psychicIcon from "./images/Psychic_icon__SwSh.png";
import rockIcon from "./images/Rock_icon__SwSh.png";
import steelIcon from "./images/Steel_icon__SwSh.png";
import waterIcon from "./images/Water_icon__SwSh.png";

const images: { [key: string]: string } = {
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
