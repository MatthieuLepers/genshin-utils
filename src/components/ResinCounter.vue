<template>
  <div class="GenshinUtils">
    <div class="Capsule">
      <img src="../../public/img/resin.png" alt="Resin" />
      <div class="ResinCounter">
        <input class="Input ResinCounterInput" type="text" min="0" :max="maxResin" v-model="resin" @mousewheel="handleMouseWheel" />
        <span class="ResinCounterMax">{{ maxResin }}</span>
      </div>
    </div>
    <button class="SubtractButton" v-if="resin >= 20" @click="handleSubtract(-20)">-20</button>
    <button class="SubtractButton" v-if="resin >= 30" @click="handleSubtract(-30)">-30</button>
    <button class="SubtractButton" v-if="resin >= 40" @click="handleSubtract(-40)">-40</button>
    <button class="SubtractButton" v-if="resin >= 60" @click="handleSubtract(-60)">-60</button>
    <div class="Timer">
      <h3>Next refill</h3>
      <p>in {{ text.nextRefill }}</p>
    </div>
    <div class="Timer">
      <h3>Fully refilled</h3>
      <p>{{ text.fullRefill }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GenshinUtils',
  data() {
    return {
      resin: null,
      rate: null,
      maxResin: null,
      nextRefill: null,
      advance: null,
      text: {
        nextRefill: null,
        fullRefill: null,
      },
    };
  },
  mounted() {
    browser.runtime.onMessage.addListener((req) => {
      const { event, details } = req;
      if (this[event]) {
        this[event](details);
      }
    });
  },
  methods: {
    updatePopup(details) {
      this.resin = details.resin;
      this.rate = details.rate;
      this.maxResin = details.maxResin;
      this.nextRefill = details.nextRefill;
      this.advance = details.advance;
      this.text.nextRefill = this.getNextRefillText();
      this.text.fullRefill = this.getFullRefillText();
    },
    handleMouseWheel(e) {
      const resin = Math.min(this.maxResin, Math.max(0, e.deltaY < 0 ? this.resin + 1 : this.resin - 1));
      browser.runtime.sendMessage({ event: 'updateStore', details: { resin } });
    },
    getNextRefillText() {
      const time = (this.nextRefill - Date.now()) / 1000;
      const seconds = `${Math.max(0, Math.floor(time % 60))}`.padStart(2, '0');
      const minutes = Math.max(0, Math.floor(time / 60));
      return `${minutes}:${seconds}`;
    },
    getFullRefillText() {
      const today = new Date();
      const fullRefillDate = new Date(this.nextRefill + ((((this.maxResin - this.resin) * this.rate) / 60) * 3600) * 1000);
      const dayStr = fullRefillDate.getDate() === today.getDate() ? 'Today' : 'Tomorrow';
      const hours = fullRefillDate.getHours();
      const minutes = `${fullRefillDate.getMinutes()}`.padStart(2, '0');
      return `${dayStr} at ${hours}:${minutes}`;
    },
    handleSubtract(amount) {
      const resin = Math.min(this.maxResin, Math.max(0, this.resin + amount));
      this.resine = resin;
      browser.runtime.sendMessage({ event: 'updateStore', details: { resin } });
    },
  },
};
</script>

<style lang="scss" src="./ResinCounter.scss">
</style>
