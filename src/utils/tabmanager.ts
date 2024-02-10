async function getTabs(): Promise<chrome.tabs.Tab[]> {
  const Tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
    currentWindow: true,
  });

  return Tabs;
}

function openTab(url?: string) {
  chrome.tabs.create(url ? { url: url } : {});
}

function removeTab(tabId: number) {
  chrome.tabs.remove(tabId);
}

export { getTabs, openTab, removeTab };
