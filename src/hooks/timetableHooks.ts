import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearModifiedCell } from 'redux/TimetableSlice';
import { AppDispatch } from 'redux/store';
import { ModifiedCell } from 'types/timetable';

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

export function useMaintainScrollPosition(modifiedCell: ModifiedCell | null) {
  const timetableWindowRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (modifiedCell && timetableWindowRef.current) {
      maintainScrollPosition(timetableWindowRef.current, modifiedCell);
      dispatch(clearModifiedCell());
    }
  });

  return timetableWindowRef;
}
