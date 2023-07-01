import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SemesterSwitcher from './SemesterSwitcher';
import { useState } from 'react';
import ConditionsTab from './conditions/ConditionsTab';
import ModulesTab from './modules/ModulesTab';

const MODULE_TAB = 'modules';
const TIMETABLE_TAB = 'timetables';

const TimetableTabs = () => {
  const [tabValue, setTabValue] = useState(MODULE_TAB);

  const handleTabChange = (_: React.SyntheticEvent, newTab: string) => {
    setTabValue(newTab);
  };

  return (
    <TabContext value={tabValue}>
      <Box display="flex" width="100%" borderBottom={1} borderColor="divider">
        <TabList onChange={handleTabChange}>
          <Tab label={MODULE_TAB} value={MODULE_TAB} />
          <Tab label={TIMETABLE_TAB} value={TIMETABLE_TAB} />
        </TabList>
        <Box flexGrow={1} />
        <SemesterSwitcher />
      </Box>

      <TabPanel value={MODULE_TAB}>
        <ModulesTab />
      </TabPanel>

      <TabPanel value={TIMETABLE_TAB}>
        <ConditionsTab showFab={tabValue === TIMETABLE_TAB} />
      </TabPanel>
    </TabContext>
  );
};

export default TimetableTabs;
