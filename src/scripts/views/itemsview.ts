import { LinkItem } from '../../types/listitem';
import { createLinkItemElement } from '../../utils/elements';
import { updateBadgeText } from '../../utils/functions';
import TabsManager from '../controllers/tabsmanager';

const listsSelector = '.item-lists';
const listEmptySelector = '.lists-empty';
const headerButtonsSelector = '.header-button-wrap';

const ItemClassName = 'item-list';
const savePageButtonClassName = 'save-page-button';
const removeButtonClassName = 'item-remove-button';

export default class ItemsView {
  tabs: TabsManager;
  listsElement: HTMLUListElement;
  listEmptyElement: HTMLElement;
  headerButtonsElement: HTMLButtonElement;
  orderView: OrderView;

  constructor() {
    this.tabs = new TabsManager();
    this.listsElement = document.querySelector(listsSelector);
    this.listEmptyElement = document.querySelector(listEmptySelector);
    this.headerButtonsElement = document.querySelector(headerButtonsSelector);
    this.orderView = new OrderView();
  }

  refresh(items: LinkItem[]) {
    if (!items) return;

    while (this.listsElement.childElementCount > 0) {
      this.listsElement.removeChild(this.listsElement.firstChild);
    }

    items.forEach((item, i) => {
      const created = createLinkItemElement(item);
      created.tabIndex = i + 2;

      this.listsElement.appendChild(created);
    });

    this.listEmptyElement.classList.toggle('hide', items.length !== 0);
  }

  mouseDown(handler: (downItemId: string, button: number) => void) {
    this.orderView.handleDown(handler);
  }

  mouseMove(handler: (moveItemId: string, isAfter: boolean) => boolean) {
    this.orderView.handleMove(handler);
  }

  mouseUp(handler: () => void) {
    this.orderView.handleUp(handler);
  }

  appendElement(addItem: (item: LinkItem) => void) {
    this.onSaveCurPage(addItem);
  }

  removeElement(removeItem: (id: string) => LinkItem) {
    this.onItemClick(removeItem);
  }

  removeButton(removeItem: (id: string) => LinkItem) {
    this.onRemoveButtonClick(removeItem);
  }

  onSaveCurPage = (addItem: (item: LinkItem) => void) => {
    this.headerButtonsElement.addEventListener('click', async (e) => {
      if (
        e.target instanceof HTMLButtonElement &&
        e.target.classList.contains(savePageButtonClassName)
      ) {
        addItem(await this.tabs.SaveAndCloseCurTab());
        updateBadgeText();
      }
    });
  };

  onItemClick = (removeItem: (id: string) => LinkItem) => {
    this.listsElement.addEventListener('click', async (e) => {
      if (
        e.target instanceof HTMLLIElement &&
        e.target.classList.contains(ItemClassName)
      ) {
        this.tabs.openTab(removeItem(e.target.id).url);
        updateBadgeText();
      }
    });

    this.listsElement.addEventListener('keypress', async (e) => {
      const focused = document.activeElement;

      if (e.target instanceof HTMLLIElement && focused) {
        const key = e.key || e.keyCode;

        if (key === 'Enter' || key === ' ') {
          this.tabs.openTab(removeItem(e.target.id).url);
          updateBadgeText();
        }
      }
    });
  };

  onRemoveButtonClick = (removeItem: (id: string) => LinkItem) => {
    this.listsElement.addEventListener('click', async (e) => {
      console.log(e.target);
      if (
        e.target instanceof HTMLButtonElement &&
        e.target.classList.contains(removeButtonClassName)
      ) {
        removeItem(e.target.parentElement.id);
        updateBadgeText();
      }
    });
  };
}

class OrderView {
  line: HTMLDivElement;

  constructor() {
    this.line = document.createElement('div');
    this.line.id = 'line';
    this.line.style.border = '1px solid #C1C1C1';
    this.line.style.width = '80%';
    this.line.style.margin = 'auto';
    this.line.style.borderRadius = '10px';
  }

  handleDown(handler: (downItemId: string, button: number) => void) {
    document.body.addEventListener('mousedown', (e: MouseEvent) => {
      if (
        e.target instanceof HTMLLIElement &&
        e.target.classList.contains(ItemClassName)
      ) {
        handler(e.target.id, e.button);
      }
    });
  }

  handleMove(handler: (moveItemId: string, isAfter: boolean) => boolean) {
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (!(e.target instanceof HTMLLIElement)) return;

      const targetRect: DOMRect = e.target.getBoundingClientRect();
      const targetMiddleLine: number = targetRect.top + targetRect.height / 2;

      if (!handler(e.target.id, !(e.clientY < targetMiddleLine))) return;

      this.createLine(e.target, e.clientY < targetMiddleLine);
    });
  }

  handleUp(handler: () => void) {
    window.addEventListener('mouseup', () => {
      if (document.getElementById('line')) {
        this.removeLine('line');
        handler();
      }
    });
  }

  createLine(element: HTMLLIElement, before: boolean = false) {
    before ? element.before(this.line) : element.after(this.line);
  }

  removeLine(id: string) {
    document.getElementById(id).remove();
  }
}
