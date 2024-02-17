import '@/public/pages/popup.scss';
import { LinkItemElement } from '../utils/elements';
import { ListItem } from '../types/listitem';
import {
  removeCurrentTab,
  addStorageData,
  updateBadgeText,
} from '../utils/functions';
import {
  getAllSyncData,
  removeSyncData,
  findSyncData,
} from '../utils/storagemanager';
import { openTab } from '../utils/tabmanager';
import ListOrderManager from '../utils/listordermanager';

class App {
  ListsElement: HTMLUListElement;
  buttonWrapElement: HTMLElement;
  listOrder: ListOrderManager;

  constructor() {
    this.ListsElement = document.querySelector('.item-lists');
    this.buttonWrapElement = document.querySelector('.button-wrap');
    this.listOrder = new ListOrderManager();

    this.updatePopup();

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    document.addEventListener(
      'mousedown',
      this.listOrder.onDown.bind(this.listOrder)
    );
    document.addEventListener(
      'mousemove',
      this.listOrder.onMove.bind(this.listOrder)
    );
    document.addEventListener(
      'mouseup',
      this.listOrder.onUp.bind(this.listOrder)
    );

    this.ListsElement.addEventListener('click', this.handleListItemClick);
    this.ListsElement.addEventListener('click', this.handleItemRemoveButton);
    // this.ListsElement.addEventListener('click', this.handleItemReviseButton);

    this.buttonWrapElement.addEventListener('click', this.handleSavePageButton);
  }

  updatePopup(): void {
    getAllSyncData().then((items) => {
      if (items === undefined) return;

      for (const item of items) {
        this.ListsElement.appendChild(LinkItemElement(item));
      }

      document
        .querySelector('.lists-empty')
        .classList.toggle('hide', items.length !== 0);
    });
  }

  async handleListItemClick(e: MouseEvent): Promise<void> {
    const target: HTMLLIElement = e.target as HTMLLIElement;

    if (target.classList.contains('item-list')) {
      const getData = await getAllSyncData();
      const item: ListItem = findSyncData(getData, target.id);

      openTab(item.url);
      removeSyncData(getData, item);
      updateBadgeText();
    }
  }

  async handleItemRemoveButton(e: MouseEvent): Promise<void> {
    const target: HTMLButtonElement = e.target as HTMLButtonElement;

    if (!target.classList.contains('item-remove-button')) return;

    getAllSyncData().then((items) => {
      removeSyncData(items, findSyncData(items, target.parentElement.id));
      updateBadgeText();
    });

    window.location.reload();
  }

  // handleItemReviseButton(e: MouseEvent) {
  //   const target: HTMLButtonElement = e.target as HTMLButtonElement;

  //   if (!target.classList.contains('item-revise-button')) return;

  //   getAllSyncData().then((items) => {
  //     const itemIndex = items.findIndex((item) => item.id === target.id);
  //     updateBadgeText();
  //   });
  // }

  handleSavePageButton(e: MouseEvent): void {
    const target: HTMLButtonElement = e.target as HTMLButtonElement;
    console.log(e);

    if (target.classList.contains('save-page-button')) {
      (async () => {
        await addStorageData(await removeCurrentTab());
        updateBadgeText();
      })();
    }
  }
}

window.onload = () => {
  new App();
};
