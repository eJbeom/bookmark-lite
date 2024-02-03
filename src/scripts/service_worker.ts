import { saveDataAndCloseTab, updateBadgeText } from '../utils/functions';

createContextMenus();

chrome.windows.onCreated.addListener(() => {
  updateBadgeText();
});

chrome.contextMenus.onClicked.addListener(onContextMenuClick);
/** contextMenus 클릭 시 스토리지에 링크를 저장하고 현재 탭을 닫는다. */

function onContextMenuClick(): void {
  saveDataAndCloseTab();
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
