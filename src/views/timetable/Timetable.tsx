import TimetableTimings from './TimetableTimings';
import styles from './Timetable.scss';
import { SCHOOLDAYS, calculateStartAndEndOfDayTimings } from 'utils/timeUtils';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  areOtherClassesAvailable,
  arrangeLessonsForWeek,
  populateSemTimetableWithLessons,
} from 'utils/timetableUtils';
import { flatMapDeep, mapValues, values } from 'lodash';
import {
  ColoredLesson,
  Lesson,
  TimetableArrangement,
} from '../../types/timetable';
import {
  areLessonsSameClass,
  getModuleRawLessons,
} from '../../utils/moduleUtils';
import TimetableDay from './TimetableDay';
import SemesterSwitcher from './SemesterSwitcher';

export const Timetable = () => {
  const modules = useSelector((state: RootState) => state.timetable.modules);
  const timetableConfig = useSelector(
    (state: RootState) => state.timetable.lessons
  );
  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );
  const activeLesson = useSelector(
    (state: RootState) => state.timetable.activeLesson
  );

  // const hidden = useSelector((state: RootState) => state.timetable.hidden);
  // const hiddenModules = hidden[currentSem];

  // Add lessons from modules into timetableConfig
  const timetableWithLessons = populateSemTimetableWithLessons(
    timetableConfig[currentSem],
    modules,
    currentSem
  );

  // Get all lessons from timetable from selected configuration
  let timetableLessons: Lesson[] = flatMapDeep(timetableWithLessons, values);

  // Show all other available classes for the module of activeLesson
  if (activeLesson) {
    const activeLessonCode = activeLesson.moduleCode;
    const activeLessonModule = modules[activeLessonCode];
    const moduleLessons = getModuleRawLessons(activeLessonModule, currentSem);

    // Remove activeLesson because it will be added/pushed later
    timetableLessons = timetableLessons.filter(
      (lesson) => !areLessonsSameClass(lesson, activeLesson)
    );

    // Get all lessons of same lessonType as activeLesson
    const sameLessonType = moduleLessons.filter(
      (lesson) => lesson.lessonType === activeLesson.lessonType
    );

    sameLessonType.forEach((lesson) => {
      // Inject module code and title to convert RawLesson -> ModifiableLesson
      const modifiableLesson: Lesson & {
        isActive?: boolean;
        isAvailable?: boolean;
      } = {
        ...lesson,
        moduleCode: activeLessonCode,
        title: activeLessonModule.title,
      };

      // Mark same lessonType and same classNo (Same combo group)
      if (areLessonsSameClass(modifiableLesson, activeLesson))
        modifiableLesson.isActive = true;
      // If not, this is just another option to choose from
      else if (lesson.lessonType === activeLesson.lessonType)
        modifiableLesson.isAvailable = true;

      timetableLessons.push(modifiableLesson);
    });
  }

  // Inject color into module
  const coloredTimetableLessons = timetableLessons.map(
    (lesson: Lesson): ColoredLesson => ({
      ...lesson,
      colorIndex: 1, // TODO: Implement colors later
    })
  );

  // Arrange all lessons by day and resolve any overlapping modules
  const arrangedLessons = arrangeLessonsForWeek(coloredTimetableLessons);
  console.log(arrangedLessons);

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
              // !readOnly && areOtherClassesAvailable(moduleTimetable, lesson.lessonType),
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
    <div className={styles.timetableWrapper}>
      <div className={styles.timetableScroll}>
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
      <SemesterSwitcher />
    </div>
  );
};

export default Timetable;
