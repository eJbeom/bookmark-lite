import {
  removeCurrentTab,
  addStorageData,
  updateBadgeText,
} from '../utils/functions';

createContextMenus();

chrome.windows.onCreated.addListener(() => {
  void updateBadgeText();
});

chrome.contextMenus.onClicked.addListener(handleContextClick);

/** storage에 링크를 저장하고 현재 탭을 닫는다. */
function handleContextClick(): void {
  (async () => {
    await addStorageData(await removeCurrentTab());
    void updateBadgeText();
  })();
}

function createContextMenus(): void {
  chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
      id: 'page_save',
      title: '페이지 저장',
      contexts: ['page'],
    });
  });
}
