import { LinkItem } from '../../types/listitem';

export default class StorageManager<T> {
  name: string;

  constructor(storageName: string) {
    this.name = storageName;
  }

  async getData(): Promise<T[]> {
    return (await chrome.storage.sync.get([this.name]))[this.name];
  }

  async setData(items: T[], item?: LinkItem): Promise<void> {
    await chrome.storage.sync.set({
      [this.name]: item ? (items ? [...items, item] : [item]) : [...items],
    });
  }
}
