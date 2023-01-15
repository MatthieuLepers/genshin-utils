class AppStore {
  /**
   * @constructor
   */
  constructor() {
    this.storage = this.DEFAULT_VALUES;

    Object.keys(this.storage).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.storage[key],
        set: (val) => { this.storage[key] = val; },
      });
    });
  }

  async load() {
    const keys = Object.keys(this.storage);
    const result = await browser.storage.local.get(keys);

    keys.forEach((key) => {
      this[key] = ![undefined, null].includes(result[key]) ? result[key] : this.DEFAULT_VALUES[key];
    });
  }

  async save() {
    await browser.storage.local.set(this.storage);
  }

  /**
   * @param {Number} resin
   * @return {Number}
   */
  getNextRefill(resin = 1) {
    return this.nextRefill + (resin * 60 * this.rate * 1000);
  }

  async refillFromLastTimestamp() {
    const now = Date.now();
    const time = (now - this.advance) / 1000;
    const minutes = Math.floor(time / 60);
    const toRefill = Math.floor(minutes / this.rate);
    const refillValue = Math.min(this.maxResin - this.resin, toRefill);

    if (refillValue > 0) {
      this.resin += refillValue;
      this.nextRefill = this.getNextRefill(toRefill);
      this.advance = now;
      this.updatePopup();
    }
  }

  async refill() {
    const now = Date.now();
    if (now >= this.nextRefill && this.resin < this.maxResin) {
      this.resin += 1;
      this.nextRefill = this.getNextRefill();
      await this.save();
    }
    this.advance = now;
    this.updatePopup();
  }

  updatePopup() {
    const [view] = browser.extension.getViews({ type: 'popup' });
    if (view) {
      browser.runtime.sendMessage({ event: 'updatePopup', details: this.storage });
    }
    browser.browserAction.setBadgeText({ text: `${this.resin}` });
  }

  /**
   * @param {Object} details
   */
  async updateStore(details) {
    Object.keys(details).forEach((key) => {
      this[key] = details[key];
    });
    await this.save();
  }

  /**
   * @return {Object}
   */
  get DEFAULT_VALUES() {
    return {
      resin: 0,
      rate: 8,
      nextRefill: Date.now(),
      advance: Date.now(),
      maxResin: 160,
    };
  }
}

export default new AppStore();
