import {
  Card,
  CardActionArea,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { SemesterDataCondensed } from '../../types/modules';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  getMainSemester,
  getModuleInfo,
  getOtherSemesters,
} from '../../utils/module';

const MoreButton = ({ semesters }: { semesters: string[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleAddModuleClick = async () => {
    // const moduleInfo = await getModuleInfo(moduleCode, setIsLoading);
    // if (moduleInfo !== undefined) {
    //   // Add moduleInfo to timetable redux slice
    //   console.log(moduleInfo);
    // }
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
          return (
            <MenuItem key={sem} onClick={handleAddModuleClick}>
              Add to {sem}
            </MenuItem>
          );
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
  const [isLoading, setIsLoading] = useState(false);

  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );

  const mainSemesterString = getMainSemester(currentSem, semesterData);
  const otherSemestersString = getOtherSemesters(
    mainSemesterString,
    semesterData
  );

  const handleAddClick = async () => {
    const moduleInfo = await getModuleInfo(moduleCode, setIsLoading);
    if (moduleInfo !== undefined) {
      // Add moduleInfo to timetable redux slice
      console.log(moduleInfo);
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        mt: 2,
        bgcolor: 'primary.main',
        color: 'white',
        height: '48px',
        width: '100%',
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
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} thickness={5} color="inherit" />
        ) : (
          <Typography variant="subtitle1">
            Add to {mainSemesterString}
          </Typography>
        )}
      </CardActionArea>

      {semesterData.length > 1 && (
        <>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            sx={{ borderRightWidth: 1, bgcolor: 'white' }}
          />
          <MoreButton semesters={otherSemestersString} />
        </>
      )}
    </Card>
  );
};

export default AddModuleButton;
