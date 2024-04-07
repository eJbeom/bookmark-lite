import { LinkItem } from '../../types/listitem';

import StorageManager from '../controllers/storagemanager';

export default class ItemsModel {
  private items: LinkItem[];
  private storage: StorageManager<LinkItem>;
  private onItemListChanged: (items: LinkItem[]) => void;
  order: OrderModel;

  constructor() {
    this.items = [];
    this.storage = new StorageManager('bmlite');
    this.order = new OrderModel();
  }

  bindItemListChanged(callback: (items: LinkItem[]) => void) {
    this.onItemListChanged = callback;
  }

  async init() {
    this.items = await this.storage.getData();
  }

  get getItems() {
    return this.items;
  }

  private async commit(items: LinkItem[]) {
    await this.storage.setData(items);
    this.items = items;
    this.onItemListChanged(items);
  }

  addItem(item: LinkItem) {
    this.items.push(item);
    this.commit(this.items);
  }

  removeItem(id: string): LinkItem {
    let removedItem = null;

    this.items = this.items.filter((item) => {
      if (item.id !== id) return true;
      else {
        removedItem = item;
        return false;
      }
    });

    this.commit(this.items);

    return removedItem;
  }

  // editItem(id: string, title: string) {
  //   this.items = this.items.map((item) =>
  //     item.id === id ? { ...item, title: title } : item
  //   );
  //   this.commit(this.items);
  // }

  findItem(id: string) {
    return this.items.find((item) => item.id === id);
  }

  mouseDown = (downItemId: string, button: number) => {
    this.order.handleDown(downItemId, button);
  };

  mouseMove = (moveItemId: string, isAfter: boolean): boolean => {
    return this.order.handleMove(moveItemId, isAfter);
  };

  mouseUp = async () => {
    const items: LinkItem[] = this.order.handleUp(this.items);

    if (items.length) await this.commit(items);
  };
}

class OrderModel {
  downItemId: string;
  moveItemId: string;
  mouseDownButton: number;
  isAfter: boolean;

  constructor() {
    this.downItemId = '';
    this.moveItemId = '';
    this.mouseDownButton = -1;
    this.isAfter = false;
  }

  handleDown(downItemId: string, button: number) {
    this.downItemId = downItemId;
    this.mouseDownButton = button;
  }

  handleMove(moveItemId: string, isAfter: boolean): boolean {
    if (this.mouseDownButton !== 0 || this.downItemId === '') return false;

    this.moveItemId = moveItemId;
    this.isAfter = isAfter;

    return true;
  }

  handleUp(items: LinkItem[]) {
    if (this.mouseDownButton !== 0) return [];

    const curItem = items.find((item) => item.id === this.downItemId);
    const curItemIndex = items.findIndex((item) => item.id === this.downItemId);
    const InsertIndex =
      items.findIndex((item) => item.id === this.moveItemId) +
      (this.isAfter ? 1 : 0);

    const newItems = [
      ...items.slice(0, InsertIndex),
      curItem,
      ...items.slice(InsertIndex, items.length),
    ];

    if (curItemIndex <= InsertIndex) newItems.splice(curItemIndex, 1);
    else if (curItemIndex > InsertIndex) newItems.splice(curItemIndex + 1, 1);

    this.downItemId = '';
    this.moveItemId = '';
    this.mouseDownButton = -1;
    this.isAfter = false;

    return newItems;
  }
}
