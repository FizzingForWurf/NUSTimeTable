import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import styles from './ConditionConfig.scss';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import { SCHOOLDAYS } from 'utils/timeUtils';
import { Add, HelpOutline } from '@mui/icons-material';

const DaySelector = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDayChange = (event: SelectChangeEvent<typeof selectedDays>) => {
    const value = event.target.value;
    setSelectedDays(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl sx={{ mr: 1, minWidth: 200 }}>
      <InputLabel>Day</InputLabel>
      <Select
        multiple
        value={selectedDays}
        label="Day"
        onChange={handleDayChange}
        input={<OutlinedInput label="Day" />}
        renderValue={(selected) => selected.join(', ')}
      >
        {SCHOOLDAYS.map((day) => (
          <MenuItem key={day} value={day}>
            <Checkbox checked={selectedDays.indexOf(day) > -1} />
            <ListItemText primary={day} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const ConditionConfig = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  return (
    <div className={styles.conditionConfigWrapper}>
      <div className={styles.pickerWrapper}>
        <TimePicker
          label="Start time"
          ampm={false}
          timeSteps={{ minutes: 30 }}
          value={startTime}
          onChange={(newStartTime) => setStartTime(newStartTime)}
          className={styles.timePicker}
        />
        <TimePicker
          label="End time"
          ampm={false}
          timeSteps={{ minutes: 30 }}
          value={endTime}
          onChange={(newEndTime) => setEndTime(newEndTime)}
          className={styles.timePicker}
        />

        <DaySelector />
      </div>

      <IconButton>
        <HelpOutline />
      </IconButton>
      <Box flexGrow={1} />

      <Button variant="contained" startIcon={<Add />}>
        Add
      </Button>
    </div>
  );
};

export default ConditionConfig;
