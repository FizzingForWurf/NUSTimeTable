import { Delete } from '@mui/icons-material';
import { Box, Card, IconButton, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { deleteModule } from 'redux/TimetableSlice';
import { AppDispatch } from 'redux/store';
import { Module } from 'types/modules';
import styles from './ModuleItem.scss';
import classNames from 'classnames';

type ModuleItemProps = {
  module: Module;
  currentSem: number;
  colorIndex: number;
};

const ModuleItem = (props: ModuleItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleModuleDelete = () => {
    dispatch(
      deleteModule({
        moduleCode: props.module.moduleCode,
        semester: props.currentSem,
      })
    );
  };

  return (
    <Card className={classNames(styles.cardContainer, 'theme-eighties')}>
      <Box
        className={classNames(
          styles.colorContainer,
          `color-${props.colorIndex}`
        )}
      />

      <Typography>
        {props.module.moduleCode} {props.module.title}
      </Typography>

      <Box sx={{ flexGrow: 1 }} />

      <IconButton onClick={handleModuleDelete}>
        <Delete />
      </IconButton>
    </Card>
  );
};

export default ModuleItem;
