import { Component, Output, EventEmitter } from "@angular/core";
import { NgFor } from "@angular/common";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzTableModule } from "ng-zorro-antd/table";
import type { questionType, controlLogicType } from "app/types";

@Component({
  selector: "concern-copy",
  imports: [NgFor, NzModalModule, NzTableModule],
  templateUrl: "./concern-copy.component.html",
  styleUrl: "./concern-copy.component.scss"
})
export class ConcernCopyComponent {
  copyVisible = false;
  tableData: questionType[] = [];
  childIds: number[] = [];
  ids = 0;
  titleText = "";
  controlLogicData: controlLogicType | undefined;
  @Output() getCopy = new EventEmitter<{ id: number; childId: number[]; data: controlLogicType[] }>();

  static copyOpen(_: questionType[], __: string, ___: number, ____: controlLogicType) {
    throw new Error("方法未实现。");
  }

  copyOpen(data: questionType[], title: string, id: number, controlLogic: controlLogicType) {
    this.copyVisible = true;
    this.tableData = data.concat().map(item => {
      delete item.children;
      return item;
    });
    this.childIds = [];
    this.titleText = title;
    this.ids = id;
    this.controlLogicData = controlLogic;
  }

  setOfChecked(id: number) {
    return this.childIds.includes(id);
  }
  onAllChecked(checked: boolean) {
    if (checked) {
      this.childIds = this.tableData.map(item => item.id);
    } else {
      this.childIds = [];
    }
  }
  onItemChecked(id: number) {
    this.childIds = this.setOfChecked(id) ? this.childIds.filter(item => item !== id) : this.childIds.concat(id);
  }
  nzCheckedChange(id: number, checked: boolean) {
    if (checked) {
      this.childIds.push(id);
    } else {
      this.childIds = this.childIds.filter(item => item !== id);
    }
  }
  handleOk() {
    if (this.childIds.length && this.controlLogicData) {
      let data: controlLogicType[] = [];
      for (let i in this.childIds) {
        data.push({ ...this.controlLogicData, childId: this.childIds[i] });
      }
      this.getCopy.emit({ id: this.ids, childId: this.childIds, data });
    }
    this.copyVisible = false;
  }
}
