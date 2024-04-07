import StorageManager from '../scripts/controllers/storagemanager';

export async function updateBadgeText(): Promise<void> {
  const storage = new StorageManager('bmlite');
  storage.getData();
  const len = (await storage.getData()).length ?? '';

  chrome.action.setBadgeText({
    text: `${len ? len : ''}`,
  });
}

export function deleteALLItems() {
  chrome.storage.sync.remove(['bmlite']);
}
