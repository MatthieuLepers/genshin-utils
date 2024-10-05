import { appStore } from '@/core/stores/AppStore';
import Timer from '@/core/ResinTimer';

let timer: Timer;

const main = async () => {
  try {
    await appStore.actions.load();
    if (!timer) {
      timer = new Timer();
      await timer.start();
      await appStore.actions.save();
    }
  } catch (e) {
    console.error(e);
  }
};

chrome.runtime.onInstalled.addListener(main);

chrome.runtime.onStartup.addListener(main);

chrome.runtime.onMessage.addListener((req) => {
  const { event, details } = req;
  if (appStore.actions[event]) {
    appStore.actions[event](details);
  }
});

chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload();
});
