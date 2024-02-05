import '@/public/pages/popup.scss';
import LinkListHandler from '../utils/LinkListHandler';
import { LinkItemElement } from '../utils/elements';
import { ListItem } from '../types/data';
import {
  removeCurrentTab,
  addStorageData,
  updateBadgeText,
} from '../utils/functions';
const linkListElement: HTMLElement = document.querySelector('.item-lists');
const buttonWrapElement: HTMLElement = document.querySelector('.button-wrap');

const linkListController = new LinkListHandler(
  linkListElement as HTMLUListElement
);

document.addEventListener('DOMContentLoaded', () => {
  updatePopup(linkListController);
});

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

linkListElement.addEventListener('click', handleListItemClick);
linkListElement.addEventListener('click', handleItemRemoveButton);
buttonWrapElement.addEventListener('click', handleSavePageButton);

function updatePopup(list: LinkListHandler): void {
  const lists_empty: HTMLElement = document.querySelector('.lists-empty');
  const lists_wrap: HTMLElement = document.querySelector('.lists-wrap');

  chrome.storage.sync.get(['bmlite']).then((res) => {
    const bmlite: ListItem[] = res.bmlite;

    if (bmlite !== undefined) {
      lists_wrap.classList.remove('hide');
      lists_empty.classList.add('hide');

      for (let i = 0; i < bmlite.length; i++) {
        const item: ListItem = bmlite[i];
        const list_item: HTMLLIElement = LinkItemElement(item);

        list.appendItem(list_item);
      }
    } else {
      lists_wrap.classList.add('hide');
      lists_empty.classList.remove('hide');
    }
  });
}

async function handleListItemClick(e: MouseEvent): Promise<void> {
  const target: HTMLLIElement = e.target as HTMLLIElement;

  if (target.className === 'item-list') {
    const getStorageData = await chrome.storage.sync.get(['bmlite']);
    const filter: ListItem[] = getStorageData.bmlite.filter(
      (item: ListItem) => {
        if (item.id === target.id) {
          chrome.tabs.create({ url: item.url });
          linkListController.removeItem(target);

          return false;
        }
        return true;
      }
    );

    await chrome.storage.sync.remove(['bmlite']);
    await chrome.storage.sync.set({
      bmlite: [...filter],
    });

    void updateBadgeText();
  }
}

async function handleItemRemoveButton(e: MouseEvent): Promise<void> {
  const target: HTMLButtonElement = e.target as HTMLButtonElement;

  if (target.classList.contains('item-remove-button')) {
    const getStorageData: { [key: string]: ListItem[] } =
      await chrome.storage.sync.get(['bmlite']);

    const filter = getStorageData.bmlite.filter((item: ListItem) => {
      if (item.id === target.parentElement.id) {
        linkListController.removeItem(target.parentElement as HTMLLIElement);

        return false;
      }
      return true;
    });

    await chrome.storage.sync.remove(['bmlite']);

    if (filter.length > 0) {
      await chrome.storage.sync.set({
        bmlite: [...filter],
      });
    } else {
      const lists_empty: HTMLElement = document.querySelector('.lists-empty');
      const lists_wrap: HTMLElement = document.querySelector('.lists-wrap');

      lists_wrap.classList.add('hide');
      lists_empty.classList.remove('hide');
    }

    void updateBadgeText();
  }
}

function handleSavePageButton(e: MouseEvent): void {
  const target: HTMLButtonElement = e.target as HTMLButtonElement;

  if (target.classList.contains('page-save-button')) {
    (async () => {
      await addStorageData(await removeCurrentTab());
      void updateBadgeText();
    })();
  }
}
