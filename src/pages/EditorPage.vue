<template>
  <q-page @scroll="onScroll">
    <timeline-canvas />
    <note-wrapper />
    <lane-caption />

    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import TimelineCanvas from 'src/components/TimelineCanvas.vue';
import NoteWrapper from 'src/components/NoteWrapper.vue';
import LaneCaption from 'src/components/LaneCaption.vue';

const offSetTop = ref(0);
const route = useRoute();

const projectId = computed(() => route.params.projectId as string);

function onScroll(e: WheelEvent) {
  offSetTop.value = (e.target as Element).scrollTop;
}
</script>

<style lang="sass">
#editor-workspace
  position: relative
  overflow: auto
  height: 100%
  width: 100%
  background-color: black

#lane-caption-container
  position: sticky
  top: 0

.lane-caption
  position: absolute
  top: 0
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
</style>
