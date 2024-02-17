import ItemsModel from '../models/itemsmodel';

export default class ListOrderController {
  items: ItemsModel;
  curSelectedItem: HTMLElement | null;
  mouseDownButton: number;
  isItemMoving: boolean;

  constructor() {
    this.items = new ItemsModel();
    this.curSelectedItem = null;
    this.mouseDownButton = -1;
    this.isItemMoving = false;
  }

  handleDown(e: MouseEvent) {
    const selected = e.target;

    if (
      selected instanceof HTMLLIElement &&
      selected.classList.contains('item-list')
    ) {
      this.curSelectedItem = e.target as HTMLElement;
      this.mouseDownButton = e.button;
    }
  }

  handleMove(e: MouseEvent) {
    if (
      !(e.target instanceof HTMLLIElement) ||
      !this.curSelectedItem ||
      this.mouseDownButton !== 0 ||
      this.curSelectedItem.id === e.target.id
    )
      return;

    this.isItemMoving = true;
  }

  handleUp() {
    this.curSelectedItem = null;
    this.isItemMoving = false;
  }

  orderChange() {
    // 순서 변경 로직
  }
}
