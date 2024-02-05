import { ListItem } from '../types/data';

async function removeCurrentTab(id?: string): Promise<ListItem> {
  const [currentTab]: chrome.tabs.Tab[] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const item: ListItem = {
    id: id ?? self.crypto.randomUUID(),
    title: currentTab.title,
    url: currentTab.url,
    favIcon: currentTab.favIconUrl,
  };

  if (currentTab.index === 0) chrome.tabs.create({});
  chrome.tabs.remove(currentTab.id);

  return new Promise((resolve) => resolve(item));
}

async function addStorageData(item: ListItem): Promise<boolean> {
  const getStorageData: { [key: string]: ListItem[] } =
    await chrome.storage.sync.get(['bmlite']);
  const data: ListItem = {
    id: item.id,
    title: item.title,
    url: item.url,
    favIcon: item.favIcon,
  };

  chrome.storage.sync.set({
    bmlite: getStorageData.bmlite ? [...getStorageData.bmlite, data] : [data],
  });

  return new Promise((resolve) => resolve(true));
}

async function updateBadgeText(): Promise<void> {
  const getStorageData: { [key: string]: ListItem[] } =
    await chrome.storage.sync.get(['bmlite']);

  chrome.action.setBadgeText({
    text: `${getStorageData.bmlite.length}`,
  });
}

export { removeCurrentTab, addStorageData, updateBadgeText };
