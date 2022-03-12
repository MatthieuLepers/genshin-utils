import Store from './classes/stores/AppStore';
import Timer from './classes/ResinTimer';

let timer;

const main = async () => {
  await Store.load();
  if (!timer) {
    timer = new Timer();
    await timer.start();
    await Store.save();
  }
};

browser.runtime.onInstalled.addListener(main);

browser.runtime.onStartup.addListener(main);

browser.runtime.onMessage.addListener((req) => {
  const { event, details } = req;
  if (Store[event]) {
    Store[event](details);
  }
});

browser.runtime.onUpdateAvailable.addListener(() => {
  browser.runtime.reload();
});
