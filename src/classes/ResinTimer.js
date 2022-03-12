import Store from './stores/AppStore';

export default class ResinTimer {
  /**
   * @constructor
   */
  constructor() {
    this.$frame = null;
    this.$started = false;
  }

  /**
   * @return {Boolean}
   */
  isStarted() {
    return this.$started;
  }

  async start() {
    if (!this.$started) {
      this.$frame = setInterval(this.task.bind(this), 1000 / 60);
      await Store.refillFromLastTimestamp();
      this.$started = true;
    }
  }

  stop() {
    if (this.$started) {
      clearInterval(this.$frame);
      this.$started = false;
    }
  }

  task() {
    Store.refill();
  }
}
