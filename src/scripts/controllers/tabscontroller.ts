export default class TabsController {
  private tabs: chrome.tabs.Tab[];

  constructor() {
    this.tabs = [];
    this.init();
  }

  async init() {
    this.tabs = await chrome.tabs.query({
      currentWindow: true,
    });
  }

  private async commit() {
    this.init();
  }

  getAllTabs(): chrome.tabs.Tab[] {
    return this.tabs;
  }

  getCurTab(): chrome.tabs.Tab {
    const [curTab] = this.tabs.filter((tab) => tab.active === true);

    return curTab;
  }

  openTab(url?: string) {
    chrome.tabs.create(url ? { url: url } : {});
    this.commit();
  }

  closeTab(tabId: number) {
    chrome.tabs.remove(tabId);
    this.commit();
  }
}
