<template>
  <!-- caption for each lane type -->
  <q-page-sticky
    expand
    position="top"
    :style="{ color: currGridColors.captionColor }"
  >
    <div
      v-for="(stylePart, index) in currLaneStyles"
      :key="index"
      class="lane-caption caption"
      :style="{
        left: `${laneXList[index] + 2}px`,
        width: `${
          index < laneXList.length
            ? laneXList[index + 1] - laneXList[index]
            : 100
        }px`,
      }"
    >
      {{ stylePart.caption }}
    </div>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from 'src/stores/editor';
import { useThemeStore } from 'src/stores/editor/theme';

const editor = useEditorStore();
const theme = useThemeStore();

const laneXList = computed(() => editor.laneXList);
const currLaneStyles = computed(() => theme.currLaneStyles);
const currGridColors = computed(() => theme.currGridColors);
</script>
