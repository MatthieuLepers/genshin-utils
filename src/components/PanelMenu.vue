<template>
  <div :class="GenerateModifiers('PanelMenuContainer', props.modifiers)" v-if="props.displayIf">
    <nav class="PanelMenu" v-if="props.displayNavIf">
      <component
        :is="props.is"
        v-bind="item.attrs"
        v-for="(item, i) in props.data"
        :key="i"
        :class="GenerateModifiers('PanelMenuButton', {
          selected: modelValue === item.id,
        })"
        type="button"
        @click="actions.handleOnClick(item)"
      >
        <slot name="button" :item="item">
          {{ item.label }}
        </slot>
      </component>
    </nav>
    <slot v-if="!modifiers.solo" :name="modelValue" />
  </div>
</template>

<script setup>
const modelValue = defineModel({ type: [String, Number, Boolean] });

const props = defineProps({
  is: { type: String, default: 'button' },
  data: { type: Object, default: () => ({}) },
  displayIf: { type: Boolean, default: true },
  displayNavIf: { type: Boolean, default: true },
  /**
   * Valid modifiers:
   * - solo : Don't provide slots
   */
  modifiers: { type: Object, default: () => ({}) },
});

const actions = {
  handleOnClick(item) {
    modelValue.value = item.id;
    if (typeof item.onClick === 'function') {
      item.onClick();
    }
  },
};
</script>

<style lang="scss" src="./PanelMenu.scss">
</style>
