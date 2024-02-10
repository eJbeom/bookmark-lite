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

const linkListElement: HTMLLIElement = document.querySelector('.item-lists');
const buttonWrapElement: HTMLElement = document.querySelector('.button-wrap');

document.addEventListener('DOMContentLoaded', () => {
  updatePopup();
});
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

linkListElement.addEventListener('click', handleListItemClick);
linkListElement.addEventListener('click', handleItemRemoveButton);
buttonWrapElement.addEventListener('click', handleSavePageButton);

function updatePopup(): void {
  getAllSyncData().then((items) => {
    if (items === undefined) return;

    for (const item of items) {
      linkListElement.appendChild(LinkItemElement(item));
    }

    document
      .querySelector('.lists-empty')
      .classList.toggle('hide', items.length !== 0);
  });
}

async function handleListItemClick(e: MouseEvent): Promise<void> {
  const target: HTMLLIElement = e.target as HTMLLIElement;

  if (target.classList.contains('item-list')) {
    const getData = await getAllSyncData();
    const item: ListItem = findSyncData(getData, target.id);

    openTab(item.url);
    removeSyncData(getData, item);
    updateBadgeText();
  }
}

async function handleItemRemoveButton(e: MouseEvent): Promise<void> {
  const target: HTMLButtonElement = e.target as HTMLButtonElement;

  if (!target.classList.contains('item-remove-button')) return;

  getAllSyncData().then((items) => {
    removeSyncData(items, findSyncData(items, target.parentElement.id)); //체이닝으로 변경 필요
    updateBadgeText();
  });

  window.location.reload();
}

function handleSavePageButton(e: MouseEvent): void {
  const target: HTMLButtonElement = e.target as HTMLButtonElement;

  if (target.classList.contains('page-save-button')) {
    (async () => {
      await addStorageData(await removeCurrentTab());
      updateBadgeText();
    })();
  }
}
