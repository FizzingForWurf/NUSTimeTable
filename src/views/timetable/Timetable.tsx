import { useEffect, useRef } from 'react';
import TimetableTimings from './TimetableTimings';
import styles from './Timetable.scss';
import { SCHOOLDAYS, calculateStartAndEndOfDayTimings } from 'utils/timeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  areOtherClassesAvailable,
  arrangeLessonsForWeek,
  populateSemTimetableWithLessons,
} from 'utils/timetableUtils';
import { flatMapDeep, mapValues, values } from 'lodash';
import {
  ColorMapping,
  ColoredLesson,
  Lesson,
  ModifiedCell,
  TimetableArrangement,
} from '../../types/timetable';
import {
  areLessonsSameClass,
  getModuleRawLessons,
} from '../../utils/moduleUtils';
import TimetableDay from './TimetableDay';
import {
  cancelModifyActiveLesson,
  clearModifiedCell,
} from 'redux/TimetableSlice';
import classNames from 'classnames';
import { fillColorMapping } from 'utils/ColorUtils';

/**
 * When a module is modified, we want to ensure the selected timetable cell
 * is in approximately the same location when all of the new options are rendered.
 * This is important for modules with a lot of options which can push the selected
 * option off screen and disorientate the user.
 */
function maintainScrollPosition(
  container: HTMLElement,
  modifiedCell: ModifiedCell
) {
  const newCell = container.getElementsByClassName(modifiedCell.className)[0];
  if (!newCell) return;

  const previousPosition = modifiedCell.position;
  const currentPosition = newCell.getBoundingClientRect();

  // We try to ensure the cell is in the same position on screen, so we calculate
  // the new position by taking the difference between the two positions and
  // adding it to the scroll position of the scroll container, which is the
  // window for the y axis and the timetable container for the x axis
  const x = currentPosition.left - previousPosition.left + window.scrollX;
  const y = currentPosition.top - previousPosition.top + window.scrollY;

  window.scroll(0, y);
  container.scrollLeft = x; // eslint-disable-line no-param-reassign
}

export const Timetable = () => {
  const timetableWindowRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

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
  const modifiedCell = useSelector(
    (state: RootState) => state.timetable.modifiedCell
  );

  // const hidden = useSelector((state: RootState) => state.timetable.hidden);
  // const hiddenModules = hidden[currentSem];

  useEffect(() => {
    if (modifiedCell && timetableWindowRef.current) {
      maintainScrollPosition(timetableWindowRef.current, modifiedCell);
      dispatch(clearModifiedCell());
    }
  });

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
  const colors = fillColorMapping(
    timetableConfig[currentSem] || {},
    {} as ColorMapping
  );
  const coloredTimetableLessons = timetableLessons.map(
    (lesson: Lesson): ColoredLesson => ({
      ...lesson,
      colorIndex: colors[lesson.moduleCode],
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
    <div
      // Inject timetable color theme here!
      className={classNames(styles.timetableWrapper, 'theme-eighties')}
      onClick={() => dispatch(cancelModifyActiveLesson())}
      onKeyUp={(e) => {
        e.key === 'Escape' && dispatch(cancelModifyActiveLesson());
      }}
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
