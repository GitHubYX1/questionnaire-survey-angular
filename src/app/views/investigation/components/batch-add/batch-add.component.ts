import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzModalService } from "ng-zorro-antd/modal";
import { QuestionnaireService } from "app/stores/questionnaire.service";

@Component({
  selector: "batch-add",
  imports: [FormsModule, NzModalModule, NzInputModule],
  templateUrl: "./batch-add.component.html",
  styleUrl: "./batch-add.component.scss"
})
export class BatchAddComponent {
  visible = false;
  optionText = "";
  indexNum = 0;

  constructor(
    public questionnaire: QuestionnaireService,
    private modal: NzModalService
  ) {}
  static batchOpen(_: number, __: string) {
    throw new Error("方法未实现。");
  }
  batchOpen(index: number, text: string) {
    this.visible = true;
    this.indexNum = index;
    this.optionText = text;
  }
  handleOk() {
    if (this.optionText.replace(/\s*/g, "") == "") {
      this.modal.warning({
        nzTitle: "提示",
        nzContent: "添加内容必填"
      });
      return;
    }
    const id = this.questionnaire.question[this.indexNum].id;
    const controlLogic = this.questionnaire.controlLogic.filter(item => item.questionIds.includes(String(id)));
    const controlOption = this.questionnaire.controlOption.filter(item => item.childId === id || item.questionIds.includes(String(id)));
    //判断是否有逻辑关联
    if (controlLogic.length || controlOption.length) {
      this.modal.confirm({
        nzTitle: "提示",
        nzContent: `原有选项有关联控制逻辑，确认批量添加并同时删除原来的控制逻辑？`,
        nzOkText: "确认",
        nzCancelText: "取消",
        nzOnOk: () => {
          this.questionnaire.optionBatchAdd({ index: this.indexNum, optionText: this.optionText });
          this.visible = false;
        }
      });
    } else {
      this.questionnaire.optionBatchAdd({ index: this.indexNum, optionText: this.optionText });
      this.visible = false;
    }
  }
}
