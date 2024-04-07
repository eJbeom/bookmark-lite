import '@/public/pages/popup.scss';

import ItemsController from './controllers/itemscontroller';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { deleteALLItems } from '../utils/functions';

class Popup {
  items: ItemsController;

  constructor() {
    this.items = new ItemsController();
    //header-button-controller
    this.init();

    document.addEventListener('contextmenu', this.handlePreventContextMenu);
  }

  init() {
    this.items.init();
  }

  handlePreventContextMenu(e: MouseEvent) {
    e.preventDefault();
  }
}

window.onload = () => {
  new Popup();
};
