import { TimetableDayArrangement } from 'types/timetable';
import styles from './TimetableDay.scss';
import TimetableRow from './TimetableRow';

type TimetableDayProps = {
  dayText: string;
  dayLessonRows: TimetableDayArrangement;
  startingIndex: number;
  endingIndex: number;
};

const TimetableDay = (props: TimetableDayProps) => {
  const columns = props.endingIndex - props.startingIndex;
  const size = 100 / (columns / 4);

  // Firefox defaults the second value (width) to auto if not specified
  const rowStyle: React.CSSProperties = {
    backgroundSize: `${size}% ${size}%`,
  };

  return (
    <li className={styles.timetableDayRow}>
      <div className={styles.dayName}>
        <span className={styles.dayNameText}>
          {props.dayText.substring(0, 3)}
        </span>
      </div>

      <div className={styles.dayRows} style={rowStyle}>
        {props.dayLessonRows.map((lessonsRow, index) => (
          <TimetableRow
            key={index}
            lessons={lessonsRow}
            startingIndex={props.startingIndex}
            endingIndex={props.endingIndex}
          />
        ))}
      </div>
    </li>
  );
};

export default TimetableDay;
