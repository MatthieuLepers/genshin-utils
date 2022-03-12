<template>
  <div class="MaterialUtils">
    <label class="MaterialInput">
      <span class="MaterialInputLabel">Weapon type</span>
      <select v-model="selectedOption" class="MaterialInputField">
        <option :value="option.value" v-for="option in options" :key="option.value" :checked="option.value === selectedOption">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label v-show="option.materials[index] > 0" :for="`${_uid}${index}`" class="MaterialInput" v-for="(key, index) in Object.keys(materials)" :key="index">
      <span class="MaterialInputLabel">{{ index + 2 }}★ material</span>
      <span class="MaterialInputField">
        <input type="text" v-model="materials[key]" :id="`${_uid}${index}`" @mousewheel="(e) => handleMouseWheel(e, key)" /> / {{ option.materials[index] }}
      </span>
    </label>

    <span class="Total">Total: {{ result }} / {{ needed }}</span>
  </div>
</template>

<script>
export default {
  name: 'MaterialUtils',
  data() {
    return {
      selectedOption: 5,
      options: [
        { value: 1, label: '★', materials: [1, 3, 1, 0] },
        { value: 2, label: '★★', materials: [1, 4, 1, 0] },
        { value: 3, label: '★★★', materials: [2, 6, 6, 3] },
        { value: 4, label: '★★★★', materials: [3, 9, 9, 4] },
        { value: 5, label: '★★★★★', materials: [5, 14, 14, 6] },
      ],
      materials: { a: 0, b: 0, c: 0, d: 0 },
    };
  },
  methods: {
    f(a = 0, b = 0, c = 0, d = 0) {
      return a + (b * 3) + (c * 9) + (d * 27);
    },
    handleMouseWheel(e, key) {
      const sign = e.deltaY < 0 ? 1 : -1;
      if (this.materials[key] + sign >= 0) {
        this.materials[key] += sign;
      }
    },
  },
  computed: {
    option() {
      const [option] = this.options.filter((o) => o.value === this.selectedOption);
      return option;
    },
    needed() {
      return this.f(...this.option.materials);
    },
    result() {
      return this.f(...Object.values(this.materials).map((i) => parseInt(i, 10)));
    },
  },
};
</script>

<style lang="scss" src="./MaterialUtils.scss">
</style>
