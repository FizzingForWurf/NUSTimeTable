import { HoverLesson, ModifiableLesson } from 'types/timetable';
import { LESSON_TYPE_ABBREV, getHoverLesson } from 'utils/timetableUtils';
import styles from './TimetableCell.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store';
import {
  cancelModifyActiveLesson,
  changeLessonConfig,
  clearHoverLesson,
  modifyActiveLesson,
  setHoverLesson,
} from 'redux/TimetableSlice';
import { isEqual } from 'lodash';
import classNames from 'classnames';

type TimetableCellProps = {
  lesson: ModifiableLesson;
  style?: React.CSSProperties;
};

const TimetableCell = (props: TimetableCellProps) => {
  // const weekText = consumeWeeks<React.ReactNode>(
  //   props.lesson.weeks,
  //   formatNumericWeeks,
  //   formatWeekRange
  // );
  const dispatch = useDispatch<AppDispatch>();
  const hoverLesson = useSelector(
    (state: RootState) => state.timetable.hoverLesson
  );

  const Cell = props.lesson.isModifiable ? 'button' : 'div';
  const isHoveredOver = isEqual(getHoverLesson(props.lesson), hoverLesson);

  const handleCellHover = (hoverLesson: HoverLesson | null) => {
    hoverLesson
      ? dispatch(setHoverLesson(hoverLesson))
      : dispatch(clearHoverLesson());
  };

  const handleTimetableCellClick = () => {
    // Ignore lessons that cannot be modified
    if (!props.lesson.isModifiable) return;

    if (props.lesson.isActive) {
      // Clicking on activeLesson means to cancel changing it
      dispatch(cancelModifyActiveLesson());
    } else if (props.lesson.isAvailable) {
      // Changing to available lesson not is NOT active
      dispatch(
        changeLessonConfig({
          semester: 1,
          newLesson: props.lesson,
        })
      );
    } else {
      // Selecting active lesson to modify lesson
      dispatch(modifyActiveLesson(props.lesson));
    }
  };

  const timetableCellStyle = classNames(styles.baseCell, {
    hoverable: !!props.lesson.isModifiable,
    [styles.clickable]: !!props.lesson.isModifiable,
    [styles.available]: props.lesson.isAvailable,
    [styles.active]: props.lesson.isActive,
    // Local hover style for the timetable planner timetable,
    [styles.hover]: isHoveredOver,
    // Global hover style for module page timetable
    hover: isHoveredOver,
  });

  return (
    <Cell
      className={timetableCellStyle}
      style={props.style}
      onMouseEnter={() => handleCellHover(getHoverLesson(props.lesson))}
      onTouchStart={() => handleCellHover(getHoverLesson(props.lesson))}
      onMouseLeave={() => handleCellHover(null)}
      onTouchEnd={() => handleCellHover(null)}
      onClick={handleTimetableCellClick}
    >
      <div className={styles.cellContainer}>
        <div className={styles.moduleName}>{props.lesson.moduleCode}</div>
        <div>
          {LESSON_TYPE_ABBREV[props.lesson.lessonType]} [{props.lesson.classNo}]
        </div>
        <div>
          {props.lesson.venue.startsWith('E-Learn')
            ? 'E-Learning'
            : props.lesson.venue}
        </div>
        {/* {weekText && <div>{weekText}</div>} */}
      </div>
    </Cell>
  );
};

export default TimetableCell;
