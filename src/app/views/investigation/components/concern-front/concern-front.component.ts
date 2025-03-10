import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzModalModule } from "ng-zorro-antd/modal";
import { ConcernSelectComponent } from "../concern-select/concern-select.component";
import type { questionType, controlLogicType } from "app/types";

interface selectType {
  value: number;
  label: string;
}

@Component({
  selector: "concern-front",
  imports: [FormsModule, NzModalModule, ConcernSelectComponent],
  templateUrl: "./concern-front.component.html",
  styleUrl: "./concern-front.component.scss"
})
export class ConcernFrontComponent {
  frontVisible = false;
  questions: questionType[] = [];
  titleText = "";
  options: selectType[] = [];
  childId: number = 0;
  control: controlLogicType | undefined;
  @Output() getFront = new EventEmitter<controlLogicType>();
  @ViewChild("ConcernSelectComponent") ConcernSelect = ConcernSelectComponent;
  static frontOpen(data: questionType[], title: string, id: number, controlLogic: controlLogicType | undefined) {
    throw new Error("方法未实现。");
  }
  //打开
  frontOpen(data: questionType[], title: string, id: number, controlLogic: controlLogicType | undefined) {
    this.frontVisible = true;
    this.questions = data;
    this.titleText = title;
    this.childId = id;
    this.options = data.map(item => {
      return { value: item.id, label: item.title };
    });
    this.control = controlLogic;
  }
  handleOk() {
    const concern = this.ConcernSelect.getConcern();
    this.getFront.emit(concern);
    this.frontVisible = false;
  }
}
