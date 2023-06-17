import {
  Card,
  CardActionArea,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { SemesterDataCondensed } from '../../types/modules';
import { useState } from 'react';

const MoreButton = ({ semesters }: { semesters: string[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <CardActionArea
        onClick={handleMoreClick}
        sx={{
          width: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowDropDown />
      </CardActionArea>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {semesters.map((sem) => {
          return <MenuItem key={sem}>Add to {sem}</MenuItem>;
        })}
      </Menu>
    </>
  );
};

const AddModuleButton = ({
  moduleCode,
  semesterData,
}: {
  moduleCode: string;
  semesterData: SemesterDataCondensed[];
}) => {
  const semesterString = [
    'Semester 1',
    'Semester 2',
    'Special Term I',
    'Special Term II',
  ];

  const semesterNames = semesterData.map((sem) => {
    return semesterString[sem.semester - 1];
  });

  const handleAddClick = () => {
    console.log(moduleCode, semesterData);
  };

  return (
    <Card
      elevation={2}
      sx={{
        mt: 2,
        bgcolor: 'primary.main',
        color: 'white',
        height: '48px',
        display: 'flex',
      }}
    >
      <CardActionArea
        onClick={handleAddClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="subtitle1">Add to {semesterNames[0]}</Typography>
      </CardActionArea>

      {semesterData.length > 1 && (
        <>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            sx={{ borderRightWidth: 1, bgcolor: 'white' }}
          />
          <MoreButton semesters={semesterNames} />
        </>
      )}
    </Card>
  );
};

export default AddModuleButton;
