import { ListItem } from '../types/data';

/** contextMenus 클릭 시 스토리지에 링크를 저장하고 현재 탭을 닫는다. */
async function onContextMenuClick(): Promise<void> {
  const [currentTab]: chrome.tabs.Tab[] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const getStorageData = await chrome.storage.sync.get(['bmlite']);
  const data: ListItem = {
    id: String(Math.random() * 1000),
    title: currentTab.title,
    url: currentTab.url,
    favIcon: currentTab.favIconUrl,
  };
  console.log(currentTab.favIconUrl);
  await chrome.storage.sync.set({
    bmlite: getStorageData.bmlite ? [...getStorageData.bmlite, data] : [data],
  });

  chrome.tabs.remove(currentTab.id);
}

chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    id: 'page_save',
    title: '페이지 저장',
    contexts: ['page'],
  });
});

chrome.contextMenus.onClicked.addListener(onContextMenuClick);
