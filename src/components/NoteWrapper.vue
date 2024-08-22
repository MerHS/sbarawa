<template>
  <div
    ref="root"
    id="note-wrapper"
    tabindex="-1"
    :style="wrapperStyle"
    @mousedown.left.self.stop="mouseDown"
  >
    <div
      v-for="(_, noteIndex) in noteManager.getAllNote()"
      :key="noteIndex"
      class="note"
    ></div>
    <div id="preview-note" class="note" :style="previewNoteStyle"></div>
    <div
      v-show="dragZone.showDragZone"
      id="drag-zone"
      :style="dragZoneStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useEditorStore, EditMode } from 'src/stores/editor';

const editor = useEditorStore();
const root = ref<HTMLElement | null>(null);

const width = computed(() => editor.widthPixel);
const height = computed(() => editor.heightPixel);
const isDragging = ref(false);
const dragPosX = ref(0);
const dragPosY = ref(0);

const wrapperStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`,
}));
const dragZoneStyle = computed(() => ({
  left: `${editor.dragZone.dragRect[0][0]}px`,
  bottom: `${editor.dragZone.dragRect[0][1]}px`,
  width: `${editor.dragZone.dragRect[1][0]}px`,
  height: `${editor.dragZone.dragRect[1][1]}px`,
}));
const dragZone = computed(() => editor.dragZone);
const editMode = computed(() => editor.editMode);
const noteManager = computed(() => editor.score.noteManager);
const previewNoteStyle = computed(() => editor.previewNoteStyle);

function mouseDown(e: MouseEvent) {
  isDragging.value = true;
  getPosition(e);
  editor.commit.editor.dragStart({
    coord: [dragPosX.value, height.value - dragPosY.value],
    isExclusive: e.ctrlKey,
  });
}

function mouseUp(e: MouseEvent) {
  if (isDragging.value) {
    e.preventDefault();
    getPosition(e);
    editor.commit.editor.dragEnd([
      dragPosX.value,
      height.value - dragPosY.value,
    ]);
  }
  isDragging.value = false;
}

function mouseMove(e: MouseEvent) {
  getPosition(e);

  if (editMode.value === EditMode.WRITE_MODE) {
    e.preventDefault();
    // function은 한가지만 하기! add dragNote
    editor.dispatch.editor.setPreviewNote([
      dragPosX.value,
      height.value - dragPosY.value,
    ]);
  } else if (isDragging.value) {
    e.preventDefault();
    editor.commit.editor.dragMove([
      dragPosX.value,
      height.value - dragPosY.value,
    ]);
  }
}

function getPosition(e: MouseEvent) {
  const el = root.value;
  if (el !== null) {
    dragPosX.value = e.pageX + el.scrollLeft - el.offsetLeft;
    dragPosY.value = e.pageY + el.scrollTop - el.offsetTop;
  }
}

watch(editMode, (newVal: EditMode) => {
  if (newVal === EditMode.WRITE_MODE) {
    editor.setPreviewNote([dragPosX.value, height.value - dragPosY.value]);
  }
});

// --- hooks ---
onMounted(() => {
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener('mouseup', mouseUp);
});
</script>

<style lang="sass">
#note-wrapper
  position: absolute
  top: 0
  left: 0
  overflow: hidden

  &:focus
    outline: none

.note
  position: absolute
  border: 1px solid green
  width: 25px
  height: 10px
  background: #c3d9ff
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

  &:hover
    border-color: red

#drag-zone
  position: absolute
  border: 1px solid green

.note
  position: absolute
</style>
