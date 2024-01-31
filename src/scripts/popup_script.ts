import '@/public/pages/popup.scss';
import LinkListHandler from '../utils/LinkListHandler';
import { LinkItemElement } from '../utils/elements';
import { ListItem } from '../types/data';

const linkListElement: HTMLElement = document.querySelector('.item-lists');

const linkListController = new LinkListHandler(
  linkListElement as HTMLUListElement
);

document.addEventListener('DOMContentLoaded', () => {
  updatePopup(linkListController);
});

linkListElement.addEventListener('click', onOpenItemAndDeleteFromList);
linkListElement.addEventListener('click', onItemRemoveButton);
document.body.addEventListener('click', onClearItems);

function updatePopup(list: LinkListHandler): void {
  const lists_empty: HTMLElement = document.querySelector('.lists-empty');
  const lists_wrap: HTMLElement = document.querySelector('.lists-wrap');

  chrome.storage.sync.get(['bmlite']).then((res) => {
    const bmlite = res.bmlite;

    if (bmlite.length > 0) {
      lists_wrap.classList.remove('hide');
      lists_empty.classList.add('hide');

      for (let i = 0; i < bmlite.length; i++) {
        const item: ListItem = bmlite[i];
        const list_item = LinkItemElement(item);

        list.appendItem(list_item);
      }
    } else {
      lists_wrap.classList.add('hide');
      lists_empty.classList.remove('hide');
    }
  });
}

function onClearItems(e: MouseEvent): void {
  const list_item = e.target as HTMLButtonElement;
  const list_item_className = list_item.className.split(' ');

  if (list_item_className.includes('clear-button')) {
    chrome.storage.sync.clear();
    window.location.reload();
  }
}

async function onOpenItemAndDeleteFromList(e: MouseEvent): Promise<void> {
  const target: HTMLLIElement = e.target as HTMLLIElement;

  if (target.className === 'item-list') {
    const getStorageData = await chrome.storage.sync.get(['bmlite']);
    const filter = getStorageData.bmlite.filter((item: ListItem) => {
      if (item.id === target.id) {
        chrome.tabs.create({ url: item.url });
        linkListController.removeItem(target);

        return false;
      }
      return true;
    });

    await chrome.storage.sync.remove(['bmlite']);
    await chrome.storage.sync.set({
      bmlite: [...filter],
    });
  }
}

async function onItemRemoveButton(e: MouseEvent): Promise<void> {
  const target: HTMLButtonElement = e.target as HTMLButtonElement;

  if (target.className === 'item-remove-button') {
    const getStorageData = await chrome.storage.sync.get(['bmlite']);
    const filter = getStorageData.bmlite.filter((item: ListItem) => {
      if (item.id === target.parentElement.id) {
        linkListController.removeItem(target.parentElement as HTMLLIElement);

        return false;
      }
      return true;
    });

    await chrome.storage.sync.remove(['bmlite']);
    await chrome.storage.sync.set({
      bmlite: [...filter],
    });
  }
}

// have to delete when to build prod
// function linkDummyData(str: string): void {
//   const item: ListItem = {
//     id: String(Math.random() * 1000),
//     title: str,
//     url: '#',
//     favIcon: undefined,
//   };

//   linkListController.appendItem(LinkItemElement(item));
// }
