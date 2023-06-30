import { ModifiableLesson } from 'types/timetable';
import TimetableCell from './TimetableCell';
import { convertTimeToIndex } from 'utils/timeUtils';
import styles from './TimetableRow.scss';

type TimetableRowProps = {
  startingIndex: number;
  endingIndex: number;
  lessons: ModifiableLesson[];
};

const TimetableRow = (props: TimetableRowProps) => {
  const totalCols = props.endingIndex - props.startingIndex;

  let prevStartIndex = props.startingIndex;
  return (
    <div className={styles.timetableRow}>
      {props.lessons.map((lesson) => {
        const startIndex = convertTimeToIndex(lesson.startTime);
        const endIndex = convertTimeToIndex(lesson.endTime);

        const size = endIndex - startIndex;

        // const dirStyle = verticalMode ? 'top' : 'marginLeft';
        // const sizeStyle = verticalMode ? 'height' : 'width';

        const dirValue = startIndex - prevStartIndex;
        const style = {
          // calc() adds a 1px gap between cells
          marginLeft: `calc(${(dirValue / totalCols) * 100}% + 1px)`,
          width: `calc(${(size / totalCols) * 100}% - 1px)`,
        };

        prevStartIndex = endIndex;

        return (
          <TimetableCell key={lesson.startTime} lesson={lesson} style={style} />
        );
      })}
    </div>
  );
};

export default TimetableRow;
