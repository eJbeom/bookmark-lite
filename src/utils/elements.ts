import { ListItem } from '../types/listitem';

function LinkItemElement(data: ListItem): HTMLLIElement {
  const item: HTMLLIElement = document.createElement('li');
  const wrap: HTMLDivElement = document.createElement('div');
  const favIcon: HTMLImageElement = document.createElement('img');
  const text: HTMLParagraphElement = document.createElement('p');
  const removeButton: HTMLButtonElement = document.createElement('button');

  favIcon.className = 'item-favIcon';
  favIcon.src = data.favIcon;

  text.className = 'item-text';
  text.textContent = data.title;

  removeButton.className = 'item-remove-button';
  removeButton.textContent = '🗑️';

  item.className = 'item-list';
  item.id = data.id;

  wrap.className = 'item-wrap';

  wrap.appendChild(favIcon);
  wrap.appendChild(text);

  item.appendChild(wrap);
  item.appendChild(removeButton);

  return item;
}

export { LinkItemElement };
