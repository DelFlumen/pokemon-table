import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Box,
  Typography,
  Fade,
  Modal,
  Backdrop,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';
import { PokemonDetails, PokemonRow } from './types';
import { capitalizeFirstLetter, getPokemonRows } from './utils';

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

const PokemonTable: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<PokemonRow[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating delay
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 3000),
        );
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=100',
        );
        const data = await response.json();
        setPokemons(getPokemonRows(data.results));
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
      width: 120,
      editable: true,
    },
  ];

  const handleEvent: GridEventListener<'rowClick'> = (
    params: GridRowParams<PokemonRow>,
  ) => {
    fetchPokemonDetails(+params.id);
  };

  const fetchPokemonDetails = async (id: number) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    setLoading(true);

    try {
      // Simulating delay
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000));

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

  return (
    <div>
      {loading && !pokemons.length ? (
        <CircularProgress />
      ) : (
        <>
          {loading && pokemons?.length && (
            <Backdrop
              sx={{
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }}
              open={loading}
            >
              <CircularProgress />
            </Backdrop>
          )}
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Typography variant="h2" gutterBottom>
              Pokemon Table
            </Typography>
          </Box>
          <DataGrid
            rows={pokemons}
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
            disableRowSelectionOnClick
            sx={{
              // disable cell selection style
              '.MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              // pointer cursor on entire row
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
            }}
          />
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
                    align="center"
                  >
                    Details of {capitalizeFirstLetter(selectedPokemon.name)}
                  </Typography>
                  <Typography
                    id="transition-modal-description"
                    mt={2}
                    align="center"
                  >
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
