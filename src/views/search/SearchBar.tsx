import { Close, Search } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { ChangeEvent, useState } from 'react';
import SearchBarResults from './SearchResults';
import { searchModule } from '../../redux/SearchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';

const searchBarWidth = '50ch';
const SearchBarWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: searchBarWidth,
  },
  zIndex: 10,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 0), // 0 for left
    width: '100%',
  },
}));

const SearchResultsBackground = ({
  show,
  hideResults,
}: {
  show: boolean;
  hideResults: () => void;
}) => {
  if (!show) return <></>;

  return (
    <Box
      onClick={hideResults}
      sx={{
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
      }}
    ></Box>
  );
};

let searchQuery = ''; // Global var to track latest search value
const SEARCH_DELAY = 200; // milliseconds

const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);

  const isLoading = useSelector((state: RootState) => state.search.isLoading);

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query);

    searchQuery = query;
    await new Promise((f) => setTimeout(f, SEARCH_DELAY));
    if (query === searchQuery) dispatch(searchModule(query));
  };

  const handleClearSearch = () => {
    setSearchValue('');
    dispatch(searchModule(''));
  };

  const handleSearchOnFocus = () => {
    if (searchValue === '') dispatch(searchModule(''));
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  return (
    <>
      <SearchBarWrapper>
        <SearchIconWrapper>
          {isLoading ? (
            <CircularProgress color="inherit" size={18} thickness={5} />
          ) : (
            <Search />
          )}
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={handleSearchOnFocus}
        />

        {searchValue.length > 0 && (
          <IconButton onClick={handleClearSearch}>
            <Close sx={{ color: 'white', opacity: 0.6 }} />
          </IconButton>
        )}
      </SearchBarWrapper>

      <SearchResultsBackground
        show={showResults}
        hideResults={handleCloseResults}
      />

      <SearchBarResults showResults={showResults} />
    </>
  );
};

export default SearchBar;
