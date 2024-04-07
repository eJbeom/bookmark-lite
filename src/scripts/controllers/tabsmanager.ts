import { LinkItem } from '../../types/listitem';

export default class TabsManager {
  private tabs: chrome.tabs.Tab[];

  constructor() {
    this.tabs = [];
  }

  private async setTabs() {
    this.tabs = await chrome.tabs.query({
      currentWindow: true,
    });
  }

  async SaveAndCloseCurTab() {
    const curTabInfo = await this.getCurTabInfo();
    const item: LinkItem = {
      id: self.crypto.randomUUID(),
      title: curTabInfo.title,
      url: curTabInfo.url,
      favIcon: curTabInfo.favIconUrl,
    };

    if ((await this.getAllTabsInfo()).length === 1) this.openTab();
    this.closeTab(curTabInfo.id);

    return item;
  }

  async getAllTabsInfo(): Promise<chrome.tabs.Tab[]> {
    await this.setTabs();

    return this.tabs;
  }

  async getCurTabInfo(): Promise<chrome.tabs.Tab> {
    await this.setTabs();
    const [curTab] = this.tabs.filter((tab) => tab.active === true);

    return curTab;
  }

  openTab(url?: string) {
    chrome.tabs.create(url ? { url: url } : {});
  }

  closeTab(tabId: number) {
    chrome.tabs.remove(tabId);
  }
}
