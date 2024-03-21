import { Pokemon, PokemonRow } from './types';

export const capitalizeFirstLetter = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

const getIdFromURL = (url: string) => {
  const matches = Array.from(url.matchAll(/\d+/g));
  return matches.length > 0 ? +matches[matches.length - 1][0] : null;
};

export const getPokemonRows = (pokemons: Pokemon[]): PokemonRow[] => {
  return pokemons.reduce((acc: PokemonRow[], curr: Pokemon) => {
    return [
      ...acc,
      {
        id: getIdFromURL(curr.url) || 0,
        name: curr.name,
      },
    ];
  }, []);
};
