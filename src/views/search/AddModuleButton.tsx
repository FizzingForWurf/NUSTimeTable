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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  getFirstAvailableSemester,
  getModuleInfo,
  getSemestersOffered,
  semesterStringName,
} from '../../utils/moduleUtils';
import { addModule } from '../../redux/TimetableSlice';

const MoreButton = ({
  moduleCode,
  semesters,
}: {
  moduleCode: string;
  semesters: number[];
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean[]>(
    Array(semesters.length).fill(false)
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleAddModuleClick = (sem: number, index: number) => async () => {
    const setIsLoading = (newState: boolean) => {
      setLoading(
        loading.map((oldState, i) => (i === index ? newState : oldState))
      );
    };
    const moduleInfo = await getModuleInfo(moduleCode, setIsLoading);
    if (moduleInfo) {
      dispatch(addModule({ semester: sem, module: moduleInfo }));
    }
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
        {semesters.map((sem, index) => {
          return (
            <MenuItem key={sem} onClick={handleAddModuleClick(sem, index)}>
              {loading[index] ? (
                <CircularProgress size={24} thickness={5} color="inherit" />
              ) : (
                <Typography>Add to {semesterStringName[sem]}</Typography>
              )}
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
  const dispatch = useDispatch<AppDispatch>();
  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );

  const mainSemester = getFirstAvailableSemester(semesterData, currentSem);
  const otherSemesters = getSemestersOffered(semesterData, mainSemester);

  const handleAddClick = async () => {
    const moduleInfo = await getModuleInfo(moduleCode, setIsLoading);
    if (moduleInfo !== undefined) {
      dispatch(addModule({ semester: mainSemester, module: moduleInfo }));
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
            Add to {semesterStringName[mainSemester]}
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
          <MoreButton moduleCode={moduleCode} semesters={otherSemesters} />
        </>
      )}
    </Card>
  );
};

export default AddModuleButton;
