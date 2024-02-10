import { ListItem } from '../types/listitem';

async function getAllSyncData(): Promise<ListItem[]> {
  return (await chrome.storage.sync.get(['bmlite'])).bmlite;
}

function findSyncData(items: ListItem[], id: string): ListItem {
  try {
    return items.find((item) => item.id === id);
  } catch (error) {
    console.error('ListItem의 id가 아닙니다.', error);
  }
}

async function setSyncData(items: ListItem[], item?: ListItem): Promise<void> {
  await chrome.storage.sync.set({
    bmlite: item ? (items ? [...items, item] : [item]) : [...items],
  });
}

async function removeSyncData(
  items: ListItem[],
  target: ListItem
): Promise<void> {
  const filtered: ListItem[] = items.filter(
    (item: ListItem) => item.id !== target.id
  );

  await setSyncData(filtered);
}

export { getAllSyncData, findSyncData, setSyncData, removeSyncData };
