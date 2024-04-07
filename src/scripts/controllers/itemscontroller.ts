import { LinkItem } from '../../types/listitem';
import ItemsModel from '../models/itemsmodel';
import ItemsView from '../views/itemsview';
import TabsManager from './tabsmanager';

export default class ItemsController {
  private model: ItemsModel;
  private view: ItemsView;
  private tabs: TabsManager;

  constructor() {
    this.model = new ItemsModel();
    this.view = new ItemsView();
    this.tabs = new TabsManager();

    this.model.bindItemListChanged(this.onItemListChanged);
    this.view.appendElement(this.onAddItem);
    this.view.removeElement(this.onRemoveItem);
    this.view.removeButton(this.onRemoveItem);
    this.view.mouseDown(this.onDown);
    this.view.mouseMove(this.onMove);
    this.view.mouseUp(this.onUp);
  }

  async init() {
    await this.model.init();
    this.view.refresh(this.model.getItems);
  }

  onItemListChanged = (items: LinkItem[]) => {
    this.view.refresh(items);
  };

  onAddItem = (item: LinkItem) => {
    this.model.addItem(item);
  };

  onRemoveItem = (id: string) => {
    return this.model.removeItem(id);
  };

  onDown = (downItemId: string, button: number) => {
    this.model.mouseDown(downItemId, button);
  };

  onMove = (moveItemId: string, isAfter: boolean): boolean => {
    return this.model.mouseMove(moveItemId, isAfter);
  };

  onUp = () => {
    this.model.mouseUp();
  };
}
