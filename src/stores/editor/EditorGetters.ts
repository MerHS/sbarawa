/* eslint-disable @typescript-eslint/no-explicit-any */
import * as R from 'ramda';

import { Coord, NoteIndex, Rect, EditMode, Note, LaneIndex } from '../../utils/types/scoreTypes';
import Fraction from '../../utils/fraction';

import { MP_LEN, MP_POS, ScoreGetters, MeasureFracPos, MeasurePulsePos } from './score';
import { ThemeGetters } from './theme';

import { editorGetterContext } from './index';


export interface CanvasInfo {
  widthPixel: number;
  heightPixel: number;
  laneXList: number[];
  laneEditableList: boolean[];
  measureYList: number[]; // TODO: array to calculation function
  mainGridYList: number[]; // TODO: array to calculation function
  subGridYList: number[]; // TODO: array to calculation function
}

export interface EditorGetters extends CanvasInfo, ScoreGetters, ThemeGetters {
  yPixelToGridPulse: (yPixel: number) => number;
  yPixelToPulse: (yPixel: number) => number;
  pulseToYPixel: (pulse: number) => number;
  canvasInfo: CanvasInfo;
  laneWidthList: number[];
}

export const getters = {
  laneXList(...args: [any, any, any, any]): CanvasInfo['laneXList'] {
    const { state } = editorGetterContext(args);
    const horizontalZoom = state.panel.horizontalZoom;
    const laneStyles = state.theme.currentTheme.laneStyles;
    return R.scan((sum, style) => sum + style.width * horizontalZoom, 0, laneStyles);
  },
  laneWidthList(...args: [any, any, any, any]): EditorGetters['laneWidthList'] {
    const { state } = editorGetterContext(args);
    const horizontalZoom = state.panel.horizontalZoom;
    const laneStyles = state.theme.currentTheme.laneStyles;
    return laneStyles.map(style => style.width * horizontalZoom);
  },
  laneEditableList(...args: [any, any, any, any]): CanvasInfo['laneEditableList'] {
    const { state } = editorGetterContext(args);
    const laneStyles = state.theme.currentTheme.laneStyles;
    return laneStyles.map(style => style.editGroup >= 0);
  },
  measureYList(...args: [any, any, any, any]): CanvasInfo['measureYList'] {
    const { getters } = editorGetterContext(args);
    const
      measurePulsePosList: MeasurePulsePos[] = getters.score.measurePulsePosList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;

    return measurePulsePosList.map(pulse => pulseToYPixel(pulse[MP_POS]));
  },
  mainGridYList(...args: [any, any, any, any]): CanvasInfo['mainGridYList'] {
    const { state, getters } = editorGetterContext(args);
    const
      mainFrac = new Fraction(1, state.panel.mainGrid),
      resolution: number = getters.score.resolution,
      measureFracPosList: MeasureFracPos[] = getters.score.measureFracPosList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;
    
    // R.chain === _.flatMap
    return R.chain(([, len, pos]) => {
      const gridCount = len.div(mainFrac).floorValue();

      return R.range(1, gridCount)
        .map(n => pos.add(mainFrac.mulInt(n)));
    }, measureFracPosList).map(
      (frac: Fraction) => pulseToYPixel(frac.mulInt(resolution).value()),
    );
  },
  subGridYList(...args: [any, any, any, any]): CanvasInfo['subGridYList'] {
    const { state, getters } = editorGetterContext(args);
    const
      subFrac = new Fraction(1, state.panel.subGrid),
      resolution: number = getters.score.resolution,
      measureFracPosList: MeasureFracPos[] = getters.score.measureFracPosList,
      pulseToYPixel: (pulse: number) => number = getters.pulseToYPixel;

    // R.chain === _.flatMap
    return R.chain(([, len, pos]) => {
      const gridCount = len.div(subFrac).floorValue();

      return R.range(1, gridCount)
        .map(n => pos.add(subFrac.mulInt(n)));
    }, measureFracPosList).map(
      (frac: Fraction) => pulseToYPixel(frac.mulInt(resolution).value()),
    );
  },
  widthPixel(...args: [any, any, any, any]): CanvasInfo['widthPixel'] {
    const { state, getters } = editorGetterContext(args);
    const
      totalWidth: number = getters.theme.totalWidth,
      horizontalZoom = state.panel.horizontalZoom;

    return totalWidth * horizontalZoom;
  },
  heightPixel(...args: [any, any, any, any]): CanvasInfo['heightPixel'] {
    const { state, getters } = editorGetterContext(args);
    const
      resolution: number = getters.score.resolution,
      maxPulse: number = getters.score.maxPulse,
      defaultHeight = state.panel.defaultHeight,
      verticalZoom = state.panel.verticalZoom;

    return defaultHeight * verticalZoom * (maxPulse / resolution);
  },
  canvasInfo(...args: [any, any, any, any]): CanvasInfo {
    const { getters } = editorGetterContext(args);
    const { laneXList, laneEditableList, measureYList,
      mainGridYList, subGridYList, widthPixel, heightPixel } = getters;

    return {
      laneXList,
      laneEditableList,
      measureYList,
      mainGridYList,
      subGridYList,
      widthPixel,
      heightPixel,
    };
  },
  yPixelToPulse(...args: [any, any, any, any]): (yPixel: number) => number {
    const { getters } = editorGetterContext(args);
    const
      maxPulse: number = getters.score.maxPulse,
      heightPixel = getters.heightPixel;

    return (yPixel: number) => maxPulse * (yPixel / heightPixel);
  },
  pulseToYPixel(...args: [any, any, any, any]): (pulse: number) => number {
    const { getters } = editorGetterContext(args);
    const
      maxPulse: number = getters.score.maxPulse,
      heightPixel = getters.heightPixel;

    return (pulse: number) => heightPixel * (pulse / maxPulse);
  },
  yPixelToGridPulse(...args: [any, any, any, any]): (yPixel: number) => number {
    const { state, getters } = editorGetterContext(args);
    const
      measurePulsePosList = getters.score.measurePulsePosList,
      measurePulseList = measurePulsePosList.map(mp => mp[MP_POS]),
      yPixelToPulse = getters.yPixelToPulse,
      subGridPulse = getters.score.resolution / state.panel.subGrid;

    return (yPixel: number) => {
      const yPulse = yPixelToPulse(yPixel);
      
      let measureIndex = measurePulseList.binaryFindFloorIndex(yPulse);
      if (measureIndex < 0) {
        measureIndex = 0;
      }

      const measurePulsePos = measurePulsePosList[measureIndex];
      const yPulseRemainder = yPulse - measurePulsePos[MP_POS];
      const gridPulse =
        measurePulsePos[MP_POS] + subGridPulse * Math.floor(yPulseRemainder / subGridPulse);

      return gridPulse;
    };
  },
  previewNoteStyle(...args: [any, any, any, any]): Partial<CSSStyleDeclaration> {
    const { state, getters } = editorGetterContext(args);
    const laneIndex = state.previewNoteValue.laneIndex;
    const laneStyles = state.theme.currentTheme.laneStyles 
    
    // invalid laneIndex -> do not display
    if (laneIndex < 0 || laneIndex >= laneStyles.length) {
      return {
        display: 'none',
      };
    }

    const yPixel = getters.pulseToYPixel(state.previewNoteValue.pulse);

    return {
      left: `${getters.laneXList[laneIndex]}px`,
      bottom: `${yPixel}px`,
      width: `${getters.laneWidthList[laneIndex]}px`,
      height: `${state.note.noteHeight}px`,
      border: `0.5px solid ${state.note.borderColor}`,
      background: `${laneStyles[laneIndex].noteColor}`,
      display: state.previewNoteValue.isVisible ? 'block' : 'none',
    };
  }
};

