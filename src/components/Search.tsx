import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
    marginRight: '80%', // sola kaydırmak için margin ekledik
    width: '30%', // genişliği azalttık
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: '200px',
    },
  }));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar({ onSearch }: { onSearch: (newSearch: string) => void }) {
  const [search, setSearch] = useState('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    onSearch(event.target.value);
  }

    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        ></Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={search}  // input değerini kontrol edin
            onChange={handleSearchChange}  // değeri güncelleyin
          />
        </Search>
      </Toolbar>
    </Box>
  );
}