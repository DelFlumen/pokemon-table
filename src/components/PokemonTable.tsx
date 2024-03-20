import React, { useState, useEffect } from 'react';
import {
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // Paper,
  CircularProgress,
  Box,
  Typography,
  Fade,
  Modal,
  Backdrop,
} from '@mui/material';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonRow {
  id: number;
  name: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const capitalizeFirstLetter = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

const getIdFromURL = (url: string) => {
  const matches = Array.from(url.matchAll(/\d+/g));
  return matches.length > 0 ? +matches[matches.length - 1][0] : null;
};

const getPokemonRows = (pokemons: Pokemon[]): PokemonRow[] => {
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

const PokemonTable: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating delay
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 2000),
        );
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=100',
        );
        const data = await response.json();
        setPokemons(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef<PokemonRow[][number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
    },
  ];

  const rows = getPokemonRows(pokemons);

  const handleEvent: GridEventListener<'rowClick'> = (
    params, // GridRowParams
    // event, // MuiEvent<React.MouseEvent<HTMLElement>>
    // details, // GridCallbackDetails
  ) => {
    fetchPokemonDetails(`Movie "${params.row.title}" clicked`);
  };

  // const sortedPokemons = pokemons.sort((a, b) => {
  //   const keyA = a[sortBy];
  //   const keyB = b[sortBy];

  //   if (keyA < keyB) return sortOrder === 'asc' ? -1 : 1;
  //   if (keyA > keyB) return sortOrder === 'asc' ? 1 : -1;
  //   return 0;
  // });

  const fetchPokemonDetails = async (id: string) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    setLoading(true);

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSelectedPokemon({
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
      });
      setLoading(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  // const handleRowClick = (url: string) => {
  //   fetchPokemonDetails(url);
  //   setIsModalOpen(true);
  // };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Typography variant="h2" gutterBottom>
              Pokemon table
            </Typography>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            onRowClick={handleEvent}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
          {/* <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pokemons.map((pokemon, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(pokemon.url)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{getIdFromURL(pokemon?.url)}</TableCell>
                    <TableCell>{capitalizeFirstLetter(pokemon.name)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
          {selectedPokemon && (
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={isModalOpen}>
                <Box sx={style}>
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Details of {capitalizeFirstLetter(selectedPokemon.name)}
                  </Typography>
                  <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    <p>ID: {selectedPokemon.id}</p>
                    <p>Height: {selectedPokemon.height}</p>
                    <p>Weight: {selectedPokemon.weight}</p>
                  </Typography>
                </Box>
              </Fade>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default PokemonTable;
