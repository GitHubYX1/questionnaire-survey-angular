import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { NgIf, NgFor } from "@angular/common";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzButtonModule } from "ng-zorro-antd/button";
import { ConcernSelectComponent } from "../concern-select/concern-select.component";
import { QuestionnaireService } from "app/stores/questionnaire.service";
import type { optionType, questionType, controlOptionType, controlLogicType } from "app/types/index";

interface optionControlType extends optionType {
  control?: controlLogicType;
}

@Component({
  selector: "concern-option",
  imports: [NgIf, NgFor, NzModalModule, NzTableModule, NzButtonModule, ConcernSelectComponent],
  templateUrl: "./concern-option.component.html",
  styleUrl: "./concern-option.component.scss"
})
export class ConcernOptionComponent {
  optionVisible = false;
  titleText = "";
  optionData: optionControlType[] = [];
  questions: questionType[] = [];
  questionId = 0;
  controlId: number | undefined;
  @Output() optionChange = new EventEmitter<controlOptionType>();
  @ViewChild("ConcernSelectComponent") ConcernSelect = ConcernSelectComponent;

  constructor(public questionnaire: QuestionnaireService) {}

  static optionOpen(data: questionType[], title: string, option: optionType[], id: number, controlOption: controlLogicType[]) {
    throw new Error("方法未实现。");
  }

  //打开
  optionOpen(data: questionType[], title: string, option: optionType[], id: number, controlOption: controlLogicType[]) {
    console.log(data, title, option);
    this.titleText = title;
    this.optionVisible = true;
    this.questions = data;
    this.questionId = id;
    console.log("controlOption", controlOption);
    const optionList: optionControlType[] = option.concat();
    if (controlOption.length) {
      optionList.forEach(item => {
        for (const element of controlOption) {
          if (item.id === element.optionId) {
            item.control = element;
          }
        }
      });
    }
    this.optionData = option;
  }

  //关联设置
  controlSet(id: number) {
    this.controlId = id;
  }
  //确定关联
  determineConcern(index: number) {
    const concern = this.ConcernSelect.getConcern();
    if (concern.parentAnswer) {
      this.optionData[index].control = concern;
    } else {
      this.optionData[index].control = undefined;
    }
    this.controlId = undefined;
  }
  //删除关联
  deleteConcern(index: number) {
    this.optionData[index].control = undefined;
    this.controlId = undefined;
  }

  handleOk() {
    const control = this.optionData.flatMap(item => {
      return item.control ? item.control : [];
    });
    const optionLogic: controlOptionType = {
      questionId: this.questionId,
      control: control
    };
    this.optionChange.emit(optionLogic);
    this.controlId = undefined;
    this.optionVisible = false;
  }
}
