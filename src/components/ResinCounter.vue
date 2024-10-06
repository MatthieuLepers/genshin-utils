<template>
  <div class="resin-counter">
    <div class="resin-counter__capsule">
      <img src="/img/resin.png" alt="Resin" />
      <input
        class="resin-counter__input"
        type="text"
        v-model="state.resin"
        @wheel.stop="actions.handleMouseWheel"
        @focus="state.focused = true"
        @blur="state.focused = false"
      />
      <span class="resin-counter__capsule__max">
        {{ state.maxResin }}
      </span>
      <MaterialButton
        class="resin-counter__capsule__sync"
        icon="icon-reload"
        title="Sync"
        :modifiers="{ secondary: true }"
        @click="actions.handleClickSync"
      />
    </div>
    <div class="resin-counter__buttons" v-if="state.resin >= 20">
      <button
        class="resin-counter__button"
        v-if="state.resin >= 20"
        @click="actions.handleSubtract(-20)"
      >-20</button>
      <button
        class="resin-counter__button"
        v-if="state.resin >= 30"
        @click="actions.handleSubtract(-30)"
      >-30</button>
      <button
        class="resin-counter__button"
        v-if="state.resin >= 40"
        @click="actions.handleSubtract(-40)"
      >-40</button>
      <button
        class="resin-counter__button"
        v-if="state.resin >= 60"
        @click="actions.handleSubtract(-60)"
      >-60</button>
    </div>
    <div class="resin-counter__timer">
      <h3>Next refill</h3>
      <p>in {{ State.nextRefill }}</p>
    </div>
    <div class="resin-counter__timer">
      <h3>Fully refilled</h3>
      <p>{{ State.fullRefill }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';

import MaterialButton from '@/components/Materials/Button/index.vue';

defineOptions({ name: 'GenshinUtils' });

const state = reactive({
  resin: null,
  rate: null,
  maxResin: null,
  nextRefill: null,
  advance: null,
  currentTime: Date.now(),
  focused: false,
});

const State = computed(() => {
  const time = (state.nextRefill - state.currentTime) / 1000;
  const seconds = `${Math.max(0, Math.floor(time % 60))}`.padStart(2, '0');
  const minutes = Math.max(0, Math.floor(time / 60));

  const today = new Date();
  const fullRefillDate = new Date(state.nextRefill + ((((state.maxResin - state.resin) * state.rate) / 60) * 3600) * 1000);
  const dayStr = fullRefillDate.getDate() === today.getDate() ? 'Today' : 'Tomorrow';

  return {
    nextRefill: `${minutes}:${seconds}`,
    fullRefill: `${dayStr} at ${fullRefillDate.getHours()}:${`${fullRefillDate.getMinutes()}`.padStart(2, '0')}`,
  };
});

const actions = {
  updatePopup(details) {
    if (!state.focused) {
      state.resin = details.resin;
    }
    state.rate = details.rate;
    state.maxResin = details.maxResin;
    state.nextRefill = details.nextRefill;
    state.advance = details.advance;
  },
  handleClickSync() {
    chrome.runtime.sendMessage({
      event: 'updateStore',
      details: { nextRefill: state.nextRefill - (state.nextRefill - state.currentTime) },
    });
  },
  handleMouseWheel(e) {
    const resin = Math.min(state.maxResin, Math.max(0, e.deltaY < 0 ? state.resin + 1 : state.resin - 1));
    chrome.runtime.sendMessage({
      event: 'updateStore',
      details: { resin },
    });
  },
  handleSubtract(amount) {
    state.resin = Math.min(state.maxResin, Math.max(0, state.resin + amount));
    chrome.runtime.sendMessage({
      event: 'updateStore',
      details: { resin: state.resin },
    });
  },
};

onMounted(() => {
  setInterval(() => {
    state.currentTime = Date.now();
  }, 1000);
  chrome.runtime.onMessage.addListener((req) => {
    const { event, details } = req;
    if (actions[event]) {
      actions[event](details);
    }
  });
});
</script>

<style lang="scss" src="./ResinCounter.scss">
</style>
