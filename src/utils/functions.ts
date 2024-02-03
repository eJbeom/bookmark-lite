import { ListItem } from '../types/data';

async function saveDataAndCloseTab(): Promise<void> {
  const [currentTab]: chrome.tabs.Tab[] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const getStorageData: { [key: string]: ListItem[] } =
    await chrome.storage.sync.get(['bmlite']);
  const data: ListItem = {
    id: self.crypto.randomUUID(),
    title: currentTab.title,
    url: currentTab.url,
    favIcon: currentTab.favIconUrl,
  };

  chrome.storage.sync.set({
    bmlite: getStorageData.bmlite ? [...getStorageData.bmlite, data] : [data],
  });

  updateBadgeText();

  if (currentTab.index === 0) chrome.tabs.create({});
  chrome.tabs.remove(currentTab.id);
}

async function updateBadgeText(): Promise<void> {
  const getStorageData: { [key: string]: ListItem[] } =
    await chrome.storage.sync.get(['bmlite']);

  chrome.action.setBadgeText({
    text: `${getStorageData.bmlite.length}`,
  });
}

export { saveDataAndCloseTab, updateBadgeText };
