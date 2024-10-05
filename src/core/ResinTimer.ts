import { appStore } from '@/core/stores/AppStore';

export default class ResinTimer {
  private frame: NodeJS.Timeout | null = null;

  private started: boolean = false;

  isStarted(): boolean {
    return this.started;
  }

  async start() {
    if (!this.started) {
      this.frame = setInterval(this.task.bind(this), 1000 / 60);
      await appStore.actions.refillFromLastTimestamp();
      this.started = true;
    }
  }

  stop() {
    if (this.started) {
      clearInterval(this.frame);
      this.started = false;
    }
  }

  task() {
    appStore.actions.refill();
  }
}
