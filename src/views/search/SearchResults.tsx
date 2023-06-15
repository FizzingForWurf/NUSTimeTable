import { Divider, Paper } from '@mui/material';
import styles from './SearchResults.scss';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import SearchResultsItem from './SearchResultsItem';

const SearchBarResults = ({ showResults }: { showResults: boolean }) => {
  const fade = showResults ? `${styles.fadeIn}` : `${styles.fadeOut}`;
  const styleWrapper = `${styles.resultsContainer} ${fade}`;

  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults
  );

  return (
    <div className={styleWrapper}>
      <Paper
        elevation={4}
        sx={{
          height: '100%',
          width: '100%',
        }}
      >
        <div className={styles.resultsListScroll}>
          <ol className={styles.resultsListWrapper}>
            {searchResults.map((module, index) => {
              return (
                <div key={module.moduleCode}>
                  <SearchResultsItem module={module} />
                  {index < searchResults.length - 1 && (
                    <Divider variant="middle" />
                  )}
                </div>
              );
            })}
          </ol>
        </div>
      </Paper>
    </div>
  );
};

export default SearchBarResults;
