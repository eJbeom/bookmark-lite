import { LinkItem } from '../../types/listitem';

export default class ItemsModel {
  private items: LinkItem[];

  constructor() {
    this.items = [];
    this.init();
  }

  async init() {
    await chrome.storage.sync.set({
      bmlite: this.items,
    });
  }

  private async commit() {
    this.init();
  }

  addItem(item: LinkItem) {
    this.items.push(item);
    this.commit();
  }

  removeItem({ id }: LinkItem) {
    this.items = this.items.filter((item) => item.id !== id);
    this.commit();
  }

  updateItem({ id, title }: LinkItem) {
    this.items.map((item) => {
      if (item.id === id) item.title = title;
    });
    this.commit();
  }

  findItem({ id }: LinkItem) {
    return this.items.find((item) => item.id === id);
  }
}
