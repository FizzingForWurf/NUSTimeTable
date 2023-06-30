import { range, sample, without } from 'lodash';

import { ColorIndex, ColorMapping, SemTimetableConfig } from 'types/timetable';
import { ModuleCode } from 'types/modules';

export const NUM_DIFFERENT_COLORS = 8;

function generateInitialColors(): ColorIndex[] {
  return range(NUM_DIFFERENT_COLORS);
}

/**
 * Returns a new index that is not present in the current color index.
 * If there are more than NUM_DIFFERENT_COLORS modules already present,
 * will try to balance the color distribution if randomize === true.
 * @param currentColors
 * @param randomize
 * @returns
 */
export function getNewColor(
  currentColors: ColorIndex[],
  randomize = true
): ColorIndex {
  let availableColors = generateInitialColors();
  currentColors.forEach((index: ColorIndex) => {
    availableColors = without(availableColors, index);
    if (availableColors.length === 0) {
      availableColors = generateInitialColors();
    }
  });

  if (randomize) {
    return sample(availableColors) ?? availableColors[0];
  }

  return availableColors[0];
}

/**
 * Color lessons by a certain property of every lesson
 *
 * e.g. clbk([...], `lessonType`) colors lessons by their type
 * @param lessons
 * @param key
 * @returns
 */
export function colorLessonsByKey<T>(
  lessons: T[],
  key: keyof T
): (T & { colorIndex: ColorIndex })[] {
  const colorMap = new Map();

  return lessons.map((lesson) => {
    let colorIndex = colorMap.get(lesson[key]);
    if (!colorMap.has(lesson[key])) {
      colorIndex = getNewColor(Array.from(colorMap.values()), false);
      colorMap.set(lesson[key], colorIndex);
    }

    return { ...lesson, colorIndex };
  });
}

/**
 * Fill up missing color slots given a timetable deterministically. This is useful
 * when importing timetables since imported modules do not have any colors defined
 * in the store
 * @param timetable
 * @param originalColors
 * @returns
 */
export function fillColorMapping(
  timetable: SemTimetableConfig,
  originalColors: ColorMapping
): ColorMapping {
  const colorMap: ColorMapping = {};
  const colorsUsed: ColorIndex[] = [];
  const withoutColors: ModuleCode[] = [];

  // Collect a list of all colors used and all modules without colors
  Object.keys(timetable).forEach((moduleCode) => {
    if (moduleCode in originalColors) {
      colorMap[moduleCode] = originalColors[moduleCode];
      colorsUsed.push(Number(originalColors[moduleCode]));
    } else {
      withoutColors.push(moduleCode);
    }
  });

  // Assign the modules without colors
  withoutColors.forEach((moduleCode) => {
    const color = getNewColor(colorsUsed, false);
    colorMap[moduleCode] = color;
    colorsUsed.push(color);
  });

  return colorMap;
}
