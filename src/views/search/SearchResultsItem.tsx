import { ModuleInformation } from '../../types/modules';
import AddModuleButton from './AddModuleButton';
import styles from './SearchResultsItem.scss';
import { Typography } from '@mui/material';

const SearchResultsItem = ({ module }: { module: ModuleInformation }) => {
  return (
    <li className={styles.resultsListItemWrapper}>
      <Typography variant="h6" align="justify" gutterBottom>
        {module.moduleCode}: {module.title}
      </Typography>

      <Typography variant="overline" gutterBottom>
        {module.faculty} | {module.moduleCredit} MC
      </Typography>

      <Typography align="justify" gutterBottom>
        {module.description}
      </Typography>

      <AddModuleButton
        moduleCode={module.moduleCode}
        semesterData={module.semesterData}
      />
    </li>
  );
};

export default SearchResultsItem;
