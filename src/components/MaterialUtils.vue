<template>
  <div class="materials">
    <label class="materials__input">
      <span class="materials__input-label">
        Weapon type
      </span>
      <select
        v-model="state.selectedOption"
        class="materials__input-field"
      >
        <option
          :value="option.value"
          v-for="option in State.options"
          :key="option.value"
          :selected="option.value === state.selectedOption"
        >
          {{ option.label }}
        </option>
      </select>
    </label>

    <label
      v-for="(key, index) in state.materials"
      :key="index"
      v-show="State.option.materials[index] > 0"
      :for="`${$uid}${index}`"
      class="materials__input"
    >
      <span class="materials__input-label">
        {{ index + 2 }}★ material
      </span>
      <span class="materials__input-field">
        <input
          type="text"
          v-model="state.materials[index]"
          :id="`${$uid}${index}`"
          @wheel="actions.handleMouseWheel($event, index)"
          @focus="state.focused = index"
          @blur="state.focused = null"
        />
        <span>/ {{ State.option.materials[index] }}</span>
      </span>
    </label>

    <span class="materials__total">
      Total: {{ State.result }} / {{ State.needed }}
    </span>
  </div>
</template>

<script setup>
import { reactive, computed, watch, getCurrentInstance, onMounted } from 'vue';

defineOptions({ name: 'MaterialUtils' });

const $uid = getCurrentInstance().uid;

const state = reactive({
  selectedOption: 5,
  materials: [0, 0, 0, 0],
  focused: null,
});

const State = computed(() => {
  const f = (a = 0, b = 0, c = 0, d = 0) => a + (b * 3) + (c * 9) + (d * 27);
  const options = [
    { value: 1, label: '★', materials: [1, 3, 1, 0] },
    { value: 2, label: '★★', materials: [1, 4, 1, 0] },
    { value: 3, label: '★★★', materials: [2, 6, 6, 3] },
    { value: 4, label: '★★★★', materials: [3, 9, 9, 4] },
    { value: 5, label: '★★★★★', materials: [5, 14, 14, 6] },
  ];
  const [option] = options.filter((o) => o.value === state.selectedOption);
  const needed = f(...option.materials);
  const result = f(...state.materials.map((i) => parseInt(i, 10)));

  return {
    options,
    option,
    needed,
    result,
  };
});

const actions = {
  handleMouseWheel(e, index) {
    state.materials[index] = Math.max(0, e.deltaY < 0 ? state.materials[index] + 1 : state.materials[index] - 1);
  },
  updatePopup(details) {
    const letters = ['a', 'b', 'c', 'd'];
    [...Array(4).keys()].forEach((index) => {
      if (state.focused !== index) {
        state.materials[index] = details[letters[index]];
      }
    });
  },
};

watch(() => state.materials, ([a, b, c, d]) => {
  chrome.runtime.sendMessage({
    event: 'updateStore',
    details: { a, b, c, d },
  });
}, { deep: true });

onMounted(() => {
  chrome.runtime.onMessage.addListener((req) => {
    const { event, details } = req;
    if (actions[event]) {
      actions[event](details);
    }
  });
});
</script>

<style lang="scss" src="./MaterialUtils.scss">
</style>
