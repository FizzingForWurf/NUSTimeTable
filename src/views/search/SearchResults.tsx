import { Divider, Fade, Paper, Typography, useTheme } from '@mui/material';
import styles from './SearchResults.scss';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import SearchResultsItem from './SearchResultsItem';
import classNames from 'classnames';

type SearchBarResultsProps = {
  showResults: boolean;
  closeResults: () => void;
};

const SearchBarResults = (props: SearchBarResultsProps) => {
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults
  );

  return (
    <div
      className={classNames(styles.resultsContainer, {
        [styles.disableClick]: !props.showResults,
      })}
    >
      <Fade in={props.showResults} timeout={transitionDuration} unmountOnExit>
        <Paper
          elevation={4}
          sx={{
            height: '100%',
            width: '100%',
          }}
        >
          <div className={styles.resultsListScroll}>
            <ol className={styles.resultsListWrapper}>
              <Typography sx={{ pb: 1, pt: 2, pr: 4, textAlign: 'end' }}>
                {searchResults?.hitsNo || 0} modules found
              </Typography>
              <Divider variant="middle" />
              {searchResults &&
                searchResults?.data.map((module, index) => {
                  return (
                    <div key={module.moduleCode}>
                      <SearchResultsItem module={module} />
                      {index < searchResults.data.length - 1 && (
                        <Divider variant="middle" />
                      )}
                    </div>
                  );
                })}
            </ol>
          </div>
        </Paper>
      </Fade>
    </div>
  );
};

export default SearchBarResults;
