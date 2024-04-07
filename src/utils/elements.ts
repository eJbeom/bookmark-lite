import { LinkItem } from '../types/listitem';

export function createLinkItemElement(data: LinkItem): HTMLLIElement {
  const item: HTMLLIElement = document.createElement('li');
  const wrap: HTMLDivElement = document.createElement('div');
  const favIcon: HTMLImageElement = document.createElement('img');
  const text: HTMLParagraphElement = document.createElement('p');
  const removeButton: HTMLButtonElement = document.createElement('button');
  // const edit: HTMLButtonElement = document.createElement('button');

  favIcon.className = 'item-favIcon';
  favIcon.src = data.favIcon;

  text.className = 'item-text';
  text.textContent = data.title;

  wrap.className = 'item-wrap';
  wrap.appendChild(favIcon);
  wrap.appendChild(text);

  removeButton.className = 'item-button item-remove-button';
  removeButton.textContent = '🗑️';

  // edit.className = 'item-button item-edit-button';
  // edit.textContent = '✍🏻';

  item.className = 'item-list';
  item.id = data.id;
  item.appendChild(wrap);
  item.appendChild(removeButton);
  // item.appendChild(edit);

  return item;
}
