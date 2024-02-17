import { getAllSyncData, findSyncData, setSyncData } from './storagemanager';

export default class ListOrderManager {
  line: UnderLineMaker;
  isList: boolean;
  target: HTMLElement;
  button: number;

  constructor() {
    this.line = new UnderLineMaker();
    this.isList = false;
    this.target = null;
    this.button = -1;
  }

  onDown(e: MouseEvent) {
    this.target = e.target as HTMLElement;
    this.button = e.button;

    if (this.target.classList.contains('item-list')) {
      this.isList = true;
    }
  }

  onMove(e: MouseEvent) {
    if (
      !this.isList ||
      !(e.target instanceof HTMLLIElement) ||
      this.button !== 0 ||
      this.target.id === e.target.id
    )
      return;

    const rectinfo = e.target.getBoundingClientRect();
    const rectLine = rectinfo.top + rectinfo.height / 2;

    if (this.line.isExist) this.line.removeLine();

    if (e.clientY > rectLine) {
      this.line.node = e.target;
      this.line.createAfterLine(e.target);
    } else if (e.clientY <= rectLine) {
      this.line.node = e.target.previousSibling as HTMLLIElement;
      this.line.createBeforeLine(e.target);
    }

    this.line.isExist = true;
    this.line.node = e.target;
  }

  async onUp() {
    this.isList = false;
    if (!this.line.isExist) return;

    this.line.removeLine();
    this.line.isExist = false;

    const getData = await getAllSyncData();
    const targetData = findSyncData(getData, this.target.id);
    const targetIndex = getData.findIndex((item) => item.id === this.target.id);
    const ListIndex =
      getData.findIndex((item) => item.id === this.line.node.id) +
      (this.line.isAfter ? 1 : 0);
    const newData = [
      ...getData.slice(0, ListIndex),
      targetData,
      ...getData.slice(ListIndex, getData.length),
    ];

    if (targetIndex <= ListIndex) newData.splice(targetIndex, 1);
    else if (targetIndex > ListIndex) newData.splice(targetIndex + 1, 1);

    setSyncData(newData);

    window.location.reload();
  }
}

class UnderLineMaker {
  isExist: boolean;
  isAfter: boolean;
  isBefore: boolean;
  underLine: HTMLElement;
  node: HTMLElement;

  constructor() {
    this.isExist = false;
    this.isAfter = false;
    this.underLine = document.createElement('div');
    this.node = null;

    this.styleInit();
  }

  styleInit() {
    this.underLine.style.width = '50%';
    this.underLine.style.margin = 'auto';
    this.underLine.style.height = '4px';
    this.underLine.style.background = 'rgb(190, 190, 190)';
    this.underLine.style.borderRadius = '100px';
  }

  createAfterLine(node: HTMLLIElement) {
    node.after(this.underLine);
    this.isAfter = true;
  }

  createBeforeLine(node: HTMLLIElement) {
    node.before(this.underLine);
    this.isAfter = false;
  }

  removeLine() {
    this.node.parentElement.removeChild(this.underLine);
  }
}
