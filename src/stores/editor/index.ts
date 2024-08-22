/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { defineModule } from 'direct-vuex';

import {
  Coord,
  NoteIndex,
  Rect,
  EditMode,
  LaneIndex,
} from '../../utils/types/scoreTypes';

import theme from './theme';
import panel from './panel';
import note from './note';
import score from './score';
import { getters } from './EditorGetters';

export interface DragZoneState {
  // ctrl + drag
  isExclusive: boolean;
  showDragZone: boolean;
  // mouseDown Start Coord
  dragStartPos: Coord;
  // [bottom-left Coord, [width, height]]
  dragRect: Rect;
}

interface PreviewNoteState {
  isVisible: boolean;
  laneIndex: LaneIndex;
  pulse: number;
}

export interface EditorState {
  editMode: EditMode;
  /** value of editMode when drag is started */
  dragStartEditMode: EditMode;
  dragZone: DragZoneState;
  selectedNotes: NoteIndex[];
  previewNoteValue: PreviewNoteState;
}

export const state: EditorState = {
  editMode: EditMode.SELECT_MODE,
  dragStartEditMode: EditMode.SELECT_MODE,
  dragZone: {
    isExclusive: false,
    showDragZone: false,
    dragStartPos: [0, 0],
    dragRect: [
      [0, 0],
      [0, 0],
    ],
  },
  selectedNotes: [],
  previewNoteValue: {
    isVisible: false,
    laneIndex: 0,
    pulse: 0,
  },
};

const mutations = {
  dragStart(
    state: EditorState,
    payload: { coord: Coord; isExclusive: boolean },
  ) {
    state.dragStartEditMode = state.editMode;

    if (state.editMode === EditMode.SELECT_MODE) {
      state.dragZone.showDragZone = true;
    }
    state.dragZone.dragStartPos = [payload.coord[0], payload.coord[1]];
    state.dragZone.dragRect = [
      [payload.coord[0], payload.coord[1]],
      [0, 0],
    ];
    state.dragZone.isExclusive = payload.isExclusive;

    if (state.editMode === EditMode.WRITE_MODE) {
      // TODO: add previewNote
    }
  },
  dragMove(state: EditorState, coord: Coord) {
    const [fromX, fromY] = state.dragZone.dragStartPos; // bottom-left point
    const [toX, toY] = coord; // top-right point

    const x = fromX < toX ? fromX : toX;
    const y = fromY < toY ? fromY : toY;
    const w = fromX < toX ? toX - fromX : fromX - toX;
    const h = fromY < toY ? toY - fromY : fromY - toY;

    state.dragZone.dragRect = [
      [x, y],
      [w, h],
    ];

    if (state.dragStartEditMode === EditMode.WRITE_MODE) {
      // TODO: calculate LN Note
    }
  },
  dragEnd(state: EditorState, coord: Coord) {
    state.dragZone.showDragZone = false;

    // TODO: if previewNote != null, commit previewNote to noteManager
  },
  changeMode(state: EditorState, mode: EditMode) {
    state.editMode = mode;

    if (mode !== EditMode.SELECT_MODE) {
      state.dragZone.showDragZone = false;
    }

    if (mode === EditMode.WRITE_MODE) {
      state.previewNoteValue.isVisible = true;
    } else {
      state.previewNoteValue.isVisible = false;
    }
  },
  setPreviewNoteStyle(
    state: EditorState,
    position: { pulse: number; laneIndex: number },
  ) {
    state.previewNoteValue.pulse = position.pulse;
    state.previewNoteValue.laneIndex = position.laneIndex;
  },
};

const actions = {
  addNote(ctx: any, coord: Coord) {},
  setPreviewNote(ctx: any, coord: Coord) {
    const { getters, commit } = editorActionContext(ctx);
    const yPixelToGridPulse = getters.yPixelToGridPulse;

    const pulse = yPixelToGridPulse(coord[1]);
    const laneIndex = getters.laneXList.binaryFindFloorIndex(coord[0]);

    if (laneIndex != null) {
      commit.setPreviewNoteStyle({ pulse, laneIndex });
    }
  },
};

const editor = defineModule({
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    theme,
    panel,
    note,
    score,
  },
});

export default editor;
export const editorActionContext = (context: any) =>
  moduleActionContext(context, editor);
export const editorGetterContext = (args: [any, any, any, any]) =>
  moduleGetterContext(args, editor);
