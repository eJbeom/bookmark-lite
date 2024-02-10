import { ListItem } from '../types/listitem';
import { getAllSyncData, setSyncData } from './storagemanager';
import { openTab, removeTab } from './tabmanager';

async function removeCurrentTab(): Promise<ListItem> {
  const Tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
    currentWindow: true,
  });
  const item: ListItem = {} as ListItem;

  for (const tab of Tabs) {
    if (tab.active === true) {
      item.id = self.crypto.randomUUID();
      item.title = tab.title;
      item.url = tab.url;
      item.favIcon = tab.favIconUrl;

      if (Tabs.length === 1) openTab();
      removeTab(tab.id);
    }
  }

  return item;
}

async function addStorageData(item: ListItem): Promise<void> {
  setSyncData(await getAllSyncData(), {
    id: item.id,
    title: item.title,
    url: item.url,
    favIcon: item.favIcon,
  });
}

async function updateBadgeText(): Promise<void> {
  const len = (await getAllSyncData())?.length;

  chrome.action.setBadgeText({
    text: `${len ? len : ''}`,
  });
}

export { removeCurrentTab, addStorageData, updateBadgeText };
