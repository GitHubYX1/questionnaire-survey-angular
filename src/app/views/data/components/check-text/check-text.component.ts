import { Component } from "@angular/core";
import { NgFor } from "@angular/common";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzTableModule } from "ng-zorro-antd/table";
import type { fillType } from "app/types";

@Component({
  selector: "check-text",
  imports: [NgFor, NzModalModule, NzTableModule],
  templateUrl: "./check-text.component.html",
  styleUrl: "./check-text.component.scss"
})
export class CheckTextComponent {
  checkShow = false;
  titleData = "";
  checkData: fillType[] = [];
  static open(title: string, fill: fillType[]) {
    throw new Error("方法未实现。");
  }
  open(title: string, fill: fillType[]) {
    this.titleData = title;
    this.checkData = fill;
    this.checkShow = true;
  }
}
