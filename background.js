import {installBackups} from './backup.js';
installBackups();
let opening = null;
chrome.action.onClicked.addListener(() => {
  if (opening) return;
  opening = (async () => {
    const url = chrome.runtime.getURL('index.html');
    const tabs = await chrome.tabs.query({});
    const tab = tabs.find(t => t.url === url || t.url?.startsWith(url + '#'));
    if (tab) {
      await chrome.tabs.update(tab.id, {active:true});
      await chrome.windows.update(tab.windowId, {focused:true});
    } else await chrome.tabs.create({url});
  })().catch(console.error).finally(() => { opening = null; });
});
