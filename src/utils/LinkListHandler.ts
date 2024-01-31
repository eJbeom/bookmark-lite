export default class LinkListHandler {
  private link_list: HTMLUListElement | null;

  constructor(list_element: HTMLUListElement) {
    this.link_list = list_element;
  }

  appendItem(item: HTMLLIElement): void {
    if (item !== null) {
      this.link_list.appendChild(item);
    } else {
      throw Error('This is not li element.');
    }
  }

  removeItem(item: HTMLLIElement): void {
    if (item !== null) {
      this.link_list.removeChild(item);
    } else {
      throw new Error('item is not exist or already removed.');
    }
  }
}
