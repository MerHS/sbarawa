<template>
  <q-layout view="hHh lpR fFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="Settings"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> SBARAWA - Drum sheet editor </q-toolbar-title>

        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          class="q-ml-xs"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/editor/test1" label="Page One" />
        <q-route-tab to="/editor/test2" label="Page Two" />
        <q-route-tab to="/editor/test3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-icon :name="editModeIcon" />
        <q-space></q-space>
        &copy; 2024 Kisoyo. / v{{ mainVersion }}
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';

defineOptions({
  name: 'MainLayout',
});

const linksList: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
];

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const editModeIcon = ref('edit');
const mainVersion = ref('v0.0.1');
</script>
