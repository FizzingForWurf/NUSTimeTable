import { HoverLesson, ModifiableLesson, ModifiedCell } from 'types/timetable';
import {
  LESSON_TYPE_ABBREV,
  getHoverLesson,
  getLessonIdentifier,
} from 'utils/timetableUtils';
import styles from './TimetableCell.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store';
import {
  cancelModifyActiveLesson,
  changeLessonConfig,
  clearHoverLesson,
  modifyActiveLesson,
  setHoverLesson,
  setModifiedCell,
} from 'redux/TimetableSlice';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { IconButton } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { useState } from 'react';

type TimetableCellProps = {
  lesson: ModifiableLesson;
  style?: React.CSSProperties;
};

const TimetableCell = (props: TimetableCellProps) => {
  const [lockCell, setLockCell] = useState(false);
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

  const handleCellLock = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents onClick timetable cell
    setLockCell(!lockCell);
  };

  const handleTimetableCellClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents onClick on timetable background
    if (!props.lesson.isModifiable || lockCell) return; // Ignore lessons that cannot be modified

    if (props.lesson.isActive) {
      // Clicking on activeLesson means to cancel changing it
      dispatch(cancelModifyActiveLesson());
      // Reset scroll position
      window.scrollTo(0, 0);
    } else if (props.lesson.isAvailable) {
      // Changing to available lesson not is NOT active
      dispatch(changeLessonConfig(props.lesson));
      // Reset scroll position
      window.scrollTo(0, 0);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const modifiedCell: ModifiedCell = {
        className: getLessonIdentifier(props.lesson),
        position: { left: rect.left, top: rect.top },
      };
      // Selecting active lesson to modify lesson
      dispatch(modifyActiveLesson(props.lesson));
      dispatch(setModifiedCell(modifiedCell));
    }
  };

  const timetableCellStyle = classNames(
    styles.baseCell,
    styles.coloredCell,
    getLessonIdentifier(props.lesson), // Label to find this lesson to maintain scroll position
    `color-${props.lesson.colorIndex}`,
    {
      hoverable: !!props.lesson.isModifiable,
      [styles.clickable]: !!props.lesson.isModifiable,
      [styles.available]: props.lesson.isAvailable,
      [styles.active]: props.lesson.isActive,
      // Local hover style for the timetable planner timetable,
      [styles.hover]: isHoveredOver,
      // Global hover style for module page timetable
      hover: isHoveredOver,
    }
  );

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
      {props.lesson.isModifiable && !props.lesson.isAvailable && (
        <IconButton size="small" onClick={handleCellLock}>
          {lockCell ? <Lock /> : <LockOpen />}
        </IconButton>
      )}
    </Cell>
  );
};

export default TimetableCell;
