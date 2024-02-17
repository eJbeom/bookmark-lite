import { ListItem } from '../types/listitem';

function LinkItemElement(data: ListItem): HTMLLIElement {
  const item: HTMLLIElement = document.createElement('li');
  const wrap: HTMLDivElement = document.createElement('div');
  const favIcon: HTMLImageElement = document.createElement('img');
  const text: HTMLParagraphElement = document.createElement('p');
  const removeButton: HTMLButtonElement = document.createElement('button');
  const reviseButton: HTMLButtonElement = document.createElement('button');

  favIcon.className = 'item-favIcon';
  favIcon.src = data.favIcon;

  text.className = 'item-text';
  text.textContent = data.title;

  wrap.className = 'item-wrap';
  wrap.appendChild(favIcon);
  wrap.appendChild(text);

  removeButton.className = 'item-button item-remove-button';
  removeButton.textContent = '🗑️';

  reviseButton.className = 'item-button item-revise-button';
  reviseButton.textContent = '✍🏻';

  item.className = 'item-list';
  item.id = data.id;
  item.appendChild(wrap);
  // item.appendChild(removeButton);
  // item.appendChild(reviseButton);

  return item;
}

export { LinkItemElement };
