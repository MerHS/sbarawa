<template>
  <canvas
    ref="canvasRef"
    id="main-canvas"
    :width="editor.widthPixel"
    :height="editor.heightPixel"
  >
  </canvas>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated } from 'vue';

import CanvasUtil from 'src/utils/canvasUtil';
import { useEditorStore } from 'src/stores/editor';
import { useThemeStore } from 'src/stores/editor/theme';

const editor = useEditorStore();
const theme = useThemeStore();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const drawer = ref<CanvasUtil | null>(null);

const currentTheme = computed(() => theme.currentTheme);
const canvasInfo = computed(() => editor.canvasInfo);

watch(canvasInfo, () => {
  renderCanvas();
});
watch(currentTheme, () => {
  renderCanvas();
});

function renderCanvas() {
  drawer.value?.drawEditor(canvasInfo.value, currentTheme.value);
}

onMounted(() => {
  drawer.value = CanvasUtil.getCanvasUtil(canvasRef.value!);
  renderCanvas();
});

onUpdated(() => {
  renderCanvas();
});
</script>

<style lang="sass">
#main-canvas
  position: absolute
</style>
