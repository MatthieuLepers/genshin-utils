<template>
  <PanelMenu
    v-model="state.currentMenu"
    is="router-link"
    :data="State.panelMenuData"
  />
  <router-view/>
</template>

<script setup>
import { reactive, computed, onMounted, onBeforeUnmount } from 'vue';

import PanelMenu from '@/components/PanelMenu.vue';

const state = reactive({
  currentMenu: 'resin',
});

const State = computed(() => ({
  panelMenuData: [
    {
      id: 'resin',
      label: 'Resin',
      attrs: { to: '/' },
    },
    {
      id: 'materials',
      label: 'Materials',
      attrs: { to: '/materials' },
    },
  ],
}));

onMounted(() => {
  chrome.runtime.sendMessage({
    event: 'setPopupState',
    details: true,
  });
});

onBeforeUnmount(() => {
  chrome.runtime.sendMessage({
    event: 'setPopupState',
    details: true,
  });
});
</script>

<style lang="scss" src="./assets/styles/style.scss">
</style>
