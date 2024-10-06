import { reactive } from 'vue';

interface IAppStorage {
  resin: number;
  rate: number;
  nextRefill: number;
  advance: number;
  maxResin: number;
  a: number,
  b: number,
  c: number,
  d: number,
}

const DEFAULT_STORAGE = {
  resin: 0,
  rate: 8,
  nextRefill: Date.now(),
  advance: Date.now(),
  maxResin: 200,
  a: 0,
  b: 0,
  c: 0,
  d: 0,
};

const useAppStore = () => {
  const storage = reactive({
    resin: 0,
    rate: 8,
    nextRefill: Date.now(),
    advance: Date.now(),
    maxResin: 200,
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  });

  const state = reactive({
    isPopupOpen: false,
  });

  const actions = {
    async load() {
      const keys = Object.keys(storage);
      const result = await chrome.storage.sync.get(keys);

      keys.forEach((key) => {
        storage[key] = ![undefined, null].includes(result[key]) ? result[key] : DEFAULT_STORAGE[key];
      });
    },
    async save() {
      await chrome.storage.sync.set({ ...storage });
    },
    getNextRefill(resin = 1): number {
      return storage.nextRefill + (resin * 60 * storage.rate * 1000);
    },
    async refillFromLastTimestamp() {
      const now = Date.now();
      const time = (now - storage.advance) / 1000;
      const minutes = Math.floor(time / 60);
      const toRefill = Math.floor(minutes / storage.rate);
      const refillValue = Math.min(storage.maxResin - storage.resin, toRefill);

      if (refillValue > 0) {
        storage.resin += refillValue;
        storage.nextRefill = actions.getNextRefill(toRefill);
        storage.advance = now;
        await actions.updatePopup();
      }
    },
    async refill() {
      const now = Date.now();
      if (now >= storage.nextRefill && storage.resin < storage.maxResin) {
        storage.resin += 1;
        storage.nextRefill = actions.getNextRefill();
        await actions.save();
      }
      storage.advance = now;
      actions.updatePopup();
    },
    setPopupState(isOpen: boolean) {
      state.isPopupOpen = isOpen;
    },
    async updatePopup() {
      if (state.isPopupOpen) {
        await chrome.runtime
          .sendMessage({
            event: 'updatePopup',
            details: storage,
          })
          .catch(() => {
            state.isPopupOpen = false;
          })
        ;
      }
      await chrome.action.setBadgeText({ text: `${storage.resin}` });
    },
    async updateStore(remoteStorage: Partial<IAppStorage>) {
      Object.keys(remoteStorage).forEach((key) => {
        storage[key] = remoteStorage[key];
      });
      await actions.save();
    },
  };

  return {
    state,
    actions,
  };
};

export const appStore = useAppStore();
