import StorageManager from './controllers/storagemanager';
import TabsManager from './controllers/tabsmanager';
import { updateBadgeText } from '../utils/functions';
import { LinkItem } from '../types/listitem';

class ServiceWorkerManager {
  tabs: TabsManager;
  storage: StorageManager<LinkItem>;

  constructor() {
    this.tabs = new TabsManager();
    this.storage = new StorageManager('bmlite');
    this.update();
  }

  update() {
    this.createContextMenus();

    chrome.windows.onCreated.addListener(this.handleUpdateBadgeText);
    chrome.contextMenus.onClicked.addListener(this.handleContextClick);
  }

  createContextMenus(): void {
    const callback = () => {
      chrome.contextMenus.create({
        id: 'page_save',
        title: '페이지 저장',
        contexts: ['page'],
      });
    };

    chrome.contextMenus.removeAll(callback);
  }

  handleUpdateBadgeText = () => {
    updateBadgeText();
  };

  handleContextClick = async () => {
    const curTabInfo = await this.tabs.SaveAndCloseCurTab();

    await this.storage.setData(await this.storage.getData(), curTabInfo);
    updateBadgeText();
  };
}

new ServiceWorkerManager();
