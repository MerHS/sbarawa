/**
 * editor/note - default / custom note settings
 * This state should be able to import and export.
 */
import { defineModule } from 'direct-vuex';

import { ColorString } from '../../../utils/types/themeTypes';
import { green, red, white, cyan, colorStr } from '../../../utils/themeConst';

export interface NoteState {
  noteHeight: number;
  hiddenNoteOpacity: number;
  borderColor: ColorString;
  borderColorOnMouseOver: ColorString;
  borderColorOnSelection: ColorString;
  borderColorOnMouseOverLN: ColorString;
}

const state: NoteState = {
  noteHeight: 10,
  hiddenNoteOpacity: 0.5,
  borderColor: colorStr(128, 128, 128),
  borderColorOnMouseOver: green,
  borderColorOnSelection: red,
  borderColorOnMouseOverLN: cyan,
};

export default defineModule({
  namespaced: true,
  state,
});
