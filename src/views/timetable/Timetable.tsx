import TimetableTimings from './TimetableTimings';
import styles from './Timetable.scss';
import { SCHOOLDAYS, calculateStartAndEndOfDayTimings } from 'utils/timeUtils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  areOtherClassesAvailable,
  arrangeLessonsForWeek,
  populateActiveLessonClasses,
  populateSemTimetableWithLessons,
} from 'utils/timetableUtils';
import { flatMapDeep, mapValues, values } from 'lodash';
import {
  ColorMapping,
  ColoredLesson,
  Lesson,
  ModifiedCell,
  ModulesMap,
  SemTimetableConfig,
  TimetableArrangement,
} from '../../types/timetable';
import { getModuleRawLessons } from '../../utils/moduleUtils';
import TimetableDay from './TimetableDay';
import { cancelModifyActiveLesson } from 'redux/TimetableSlice';
import classNames from 'classnames';
import { useMaintainScrollPosition } from 'hooks/timetableHooks';

type TimetableProps = {
  readOnly: boolean;
  currentSem: number;
  modules: ModulesMap;
  colors: ColorMapping;
  timetableConfig: SemTimetableConfig;
  activeLesson?: Lesson | null;
  modifiedCell?: ModifiedCell | null;
};

export const Timetable = (props: TimetableProps) => {
  const {
    readOnly,
    currentSem,
    modules,
    timetableConfig,
    activeLesson = null,
    modifiedCell = null,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const timetableWindowRef = useMaintainScrollPosition(modifiedCell);

  // Add lessons from modules into timetableConfig
  const timetableWithLessons = populateSemTimetableWithLessons(
    timetableConfig,
    modules,
    currentSem
  );

  // Get all lessons from timetable from selected configuration
  let timetableLessons: Lesson[] = flatMapDeep(timetableWithLessons, values);

  // Show all other available classes for the module of activeLesson
  if (activeLesson) {
    timetableLessons = populateActiveLessonClasses(
      activeLesson,
      timetableLessons,
      currentSem,
      modules
    );
  }

  // Inject color into module
  const coloredTimetableLessons = timetableLessons.map(
    (lesson: Lesson): ColoredLesson => ({
      ...lesson,
      colorIndex: props.colors[lesson.moduleCode],
    })
  );

  // Arrange all lessons by day and resolve any overlapping modules
  const arrangedLessons = arrangeLessonsForWeek(coloredTimetableLessons);

  // Add modifiable flag to arranged lessons
  const arrangedLessonsWithModifiableFlag: TimetableArrangement = mapValues(
    arrangedLessons,
    (dayRows) =>
      dayRows.map((row) =>
        row.map((lesson) => {
          const module = modules[lesson.moduleCode];
          const moduleLessons = getModuleRawLessons(module, currentSem);

          return {
            ...lesson,
            isModifiable:
              !readOnly &&
              areOtherClassesAvailable(moduleLessons, lesson.lessonType),
          };
        })
      )
  );

  const { startingIndex, endingIndex } =
    calculateStartAndEndOfDayTimings(timetableLessons);
  // const currentDayIndex = getDayIndex(); // Monday = 0, Friday = 4

  // Check if Saturday exists out of all selected lessons
  const schoolDays = SCHOOLDAYS.filter(
    (day) => day !== 'Saturday' || arrangedLessons.Saturday
  );

  const EMPTY_ROW_LESSONS = [[]];

  return (
    <div
      // Inject timetable color theme here!
      className={classNames(styles.timetableWrapper, 'theme-eighties')}
      onClick={
        !readOnly ? () => dispatch(cancelModifyActiveLesson()) : undefined
      }
      onKeyUp={
        !readOnly
          ? (e) => {
              e.key === 'Escape' && dispatch(cancelModifyActiveLesson());
            }
          : undefined
      }
      role="presentation" // Address eslint: no-static-element-interactions
    >
      <div className={styles.timetableScroll} ref={timetableWindowRef}>
        <div className={styles.timetableContainer}>
          <TimetableTimings
            startingIndex={startingIndex}
            endingIndex={endingIndex}
          />
          <ol className={styles.timetableList}>
            {schoolDays.map((dayText) => (
              <TimetableDay
                key={dayText}
                dayText={dayText}
                dayLessonRows={
                  arrangedLessonsWithModifiableFlag[dayText] ||
                  EMPTY_ROW_LESSONS
                }
                startingIndex={startingIndex}
                endingIndex={endingIndex}
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
