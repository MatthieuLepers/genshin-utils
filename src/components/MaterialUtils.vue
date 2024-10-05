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
      v-for="(key, index) in Object.keys(state.materials)"
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
          v-model="state.materials[key]"
          :id="`${$uid}${index}`"
          @wheel="actions.handleMouseWheel($event, key)"
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
import { reactive, computed, getCurrentInstance } from 'vue';

defineOptions({ name: 'MaterialUtils' });

const $uid = getCurrentInstance().uid;

const state = reactive({
  selectedOption: 5,
  materials: { a: 0, b: 0, c: 0, d: 0 },
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
  const result = f(...Object.values(state.materials).map((i) => parseInt(i, 10)));

  return {
    options,
    option,
    needed,
    result,
  };
});

const actions = {
  handleMouseWheel(e, key) {
    state.materials[key] = Math.max(0, e.deltaY < 0 ? state.materials[key] + 1 : state.materials[key] - 1);
  },
};
</script>

<style lang="scss" src="./MaterialUtils.scss">
</style>
