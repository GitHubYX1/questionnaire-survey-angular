import { Component, Input, Output, EventEmitter } from "@angular/core";
import { NgIf, NgSwitch, CommonModule, NgFor } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzRateModule } from "ng-zorro-antd/rate";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzMessageService } from "ng-zorro-antd/message";
import { SliderItemComponent } from "app/components/slider-item/slider-item.component";
import { MatrixItemComponent } from "app/components/matrix-item/matrix-item.component";
import { RichTinymceComponent } from "app/components/rich-tinymce/rich-tinymce.component";
import { MatrixEditorComponent } from "../matrix-editor/matrix-editor.component";
import { SliderOptionComponent } from "../slider-option/slider-option.component";
import { QuestionnaireService } from "app/stores/questionnaire.service";
import type { questionType, controlLogicType } from "app/types/index";
import { scoreOptionInit } from "app/utils/index";
import { typeEnum, validateOption } from "assets/common/enums";

@Component({
  selector: "survey-item",
  imports: [
    NgIf,
    NgSwitch,
    CommonModule,
    NgFor,
    FormsModule,
    NzRadioModule,
    NzCheckboxModule,
    NzSelectModule,
    NzRateModule,
    NzInputModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    NzTableModule,
    SliderItemComponent,
    MatrixItemComponent,
    RichTinymceComponent,
    MatrixEditorComponent,
    SliderOptionComponent
  ],
  templateUrl: "./survey-item.component.html",
  styleUrl: "./survey-item.component.scss"
})
export class SurveyItemComponent {
  @Input() index = 0;
  @Input() question: questionType = {} as questionType;
  @Input() serialNum = 0;
  @Input() insertNum = 0;
  @Input() showConcern = "";
  @Input() optionLogic: controlLogicType[] = [];
  @Output() batchOption = new EventEmitter<{ index: number; text: string }>(); //批量增加
  @Output() concern = new EventEmitter<{ index: number; id: number; title: string; state: number }>();
  typeEnum = typeEnum;
  validateOption = validateOption;
  optionInit = scoreOptionInit(10);
  editorType = [typeEnum.RADIO, typeEnum.CHECKBOX, typeEnum.FILL];
  matrixType = [typeEnum.MATRIX_RADIO, typeEnum.MATRIX_CHECKBOX, typeEnum.MATRIX_SLIDER];
  typeRadio = this.question.type;
  mustBoolean = true;
  scoreOption = 1;

  constructor(
    public questionnaire: QuestionnaireService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}
  generateColumn(column: number) {
    return { "grid-template-columns": `repeat(${column}, minmax(0, 1fr))` };
  }
  isBasicsOption(type: typeEnum) {
    return [typeEnum.RADIO, typeEnum.CHECKBOX, typeEnum.DROP].includes(type);
  }
  matrixOption(type: typeEnum) {
    return [typeEnum.MATRIX_RADIO, typeEnum.MATRIX_CHECKBOX, typeEnum.MATRIX_SLIDER].includes(type);
  }
  matrixJudge(type: typeEnum) {
    if (this.matrixType.includes(type)) {
      return type;
    } else {
      return false;
    }
  }
  //编辑
  editCount() {
    this.typeRadio = this.question.type;
    this.mustBoolean = this.question.must === 1 ? true : false;
    this.scoreOption = this.question.option.length;
    this.questionnaire.editCount(this.question.id);
  }
  //复制
  copyClick() {
    const copy = { ...this.question };
    this.questionnaire.copy(copy, this.index);
  }
  //删除
  erasureClick() {
    this.modal.confirm({
      nzTitle: "提示",
      nzContent: `删除该问题？`,
      nzOkText: "确认",
      nzCancelText: "取消",
      nzOnOk: () => {
        const id = this.question.id;
        const controlLogic = this.questionnaire.controlLogic.filter(item => item.childId === id || item.questionIds.includes(String(id)));
        const controlOption = this.questionnaire.controlOption.filter(item => item.childId === id || item.questionIds.includes(String(id)));
        //判断是否有逻辑关联
        if (controlLogic.length || controlOption.length) {
          this.modal.confirm({
            nzTitle: "提示",
            nzContent: `题目有关联控制逻辑，删除题目，和题目相关的逻辑控制会删除，是否继续？`,
            nzOkText: "确认",
            nzCancelText: "取消",
            nzOnOk: () => {
              this.questionnaire.erasure(id, this.index);
            }
          });
        } else {
          this.questionnaire.erasure(id, this.index);
        }
      }
    });
  }
  //移动
  moveClick(action: string) {
    this.questionnaire.move(this.index, action);
  }
  //题目隐藏
  hideClick(isHide: 0 | 1) {
    this.questionnaire.whetherHide(this.index, isHide);
  }
  //切换类型
  typeChange() {
    const text =
      this.typeRadio !== typeEnum.MATRIX_SLIDER && this.question.type !== typeEnum.MATRIX_SLIDER
        ? `是否将${this.question.type}题改为${this.typeRadio}题？`
        : `将${this.question.type}题改为${this.typeRadio}题选项会发生改变，是否修改？`;
    this.modal.confirm({
      nzTitle: "提示",
      nzContent: text,
      nzOkText: "确认",
      nzCancelText: "取消",
      nzOnOk: () => {
        if (this.typeRadio === typeEnum.FILL) {
          const id = this.question.id;
          const controlLogic = this.questionnaire.controlLogic.filter(item => item.childId === id || item.questionIds.includes(String(id)));
          const controlOption = this.questionnaire.controlOption.filter(item => item.childId === id || item.questionIds.includes(String(id)));
          //判断是否有逻辑关联
          if (controlLogic.length || controlOption.length) {
            this.modal.confirm({
              nzTitle: "提示",
              nzContent: `题目有关联控制逻辑，修改题目类型，和题目相关的逻辑控制会删除，是否继续？`,
              nzOkText: "确认",
              nzCancelText: "取消",
              nzOnOk: () => {
                this.questionnaire.typeModify(this.index, this.typeRadio, id);
              },
              nzOnCancel: () => {
                this.typeRadio = this.question.type;
              }
            });
          } else {
            this.questionnaire.typeModify(this.index, this.typeRadio);
          }
        } else {
          this.questionnaire.typeModify(this.index, this.typeRadio);
        }
      },
      nzOnCancel: () => {
        this.typeRadio = this.question.type;
      }
    });
  }
  //点击必答
  checkboxChange() {
    this.questionnaire.mustSelect(this.index, this.mustBoolean ? 1 : 0);
  }
  //选项移动
  optionMoveClick(optionIndex: number, action: string) {
    if (optionIndex == 0 && action == "上") return;
    this.questionnaire.optionMove(this.index, optionIndex, action);
  }
  //选项移除
  optionRemoveClick(optionIndex: number, optionId: number) {
    if (this.question.option.length > 1) {
      const id = this.question.id;
      let bool = false;
      // 判断是否存在逻辑
      for (const item of this.questionnaire.controlLogic) {
        const questionIdsArray = item.questionIds.split(",");
        const idIndex = questionIdsArray.indexOf(String(id));
        if (idIndex !== -1) {
          bool = item.parentAnswer.split("|")[idIndex].split(",").includes(String(optionId));
          if (bool) break;
        }
      }
      // 判断是存在选项关联逻辑
      if (!bool) {
        for (const item of this.questionnaire.controlOption) {
          if (item.childId === id && item.optionId === optionId) {
            bool = true;
            break;
          }
          const questionIdsArray = item.questionIds.split(",");
          const idIndex = questionIdsArray.indexOf(String(id));
          if (idIndex !== -1) {
            bool = item.parentAnswer.split("|")[idIndex].split(",").includes(String(optionId));
            if (bool) break;
          }
        }
      }
      //判断是否有逻辑关联
      if (bool) {
        this.modal.confirm({
          nzTitle: "提示",
          nzContent: `题目选项有关联控制逻辑，删除选项，和题目相关的逻辑控制会删除，是否继续？`,
          nzOkText: "确认",
          nzCancelText: "取消",
          nzOnOk: () => {
            this.questionnaire.optionRemove(this.index, optionIndex, optionId);
          }
        });
      } else {
        this.questionnaire.optionRemove(this.index, optionIndex);
      }
    } else {
      const text = this.question.children && this.question.children.length === 0 ? "不能删除所有选项" : "不能删除所有列";
      this.message.warning(text);
    }
  }
  //选项添加
  optionAddClick(optionIndex: number) {
    if (optionIndex === -2) {
      const text = this.question.option.map(item => item.content).join("\n");
      this.batchOption.emit({ index: this.index, text });
    } else {
      this.questionnaire.optionAdd(this.index, optionIndex);
    }
  }
  //题目关联
  concernClick(state: number) {
    this.concern.emit({ index: this.index, id: this.question.id, title: this.question.type !== typeEnum.PARAGRAPH ? this.question.title : typeEnum.PARAGRAPH, state });
  }
  //选项个数
  scoreOptionChange(num: number) {
    this.questionnaire.scoreOptionModify(this.index, num);
  }
  //选项逻辑控制
  optionLogicText(id: number, control: controlLogicType[]) {
    for (const item of control) {
      if (id === item.optionId) {
        return `（${this.questionnaire.logicText(item)}）`;
      }
    }
    return "";
  }

  // 数字输入框
  sliderChange(optionIndex: number, value: number) {
    this.questionnaire.sliderModify(this.index, optionIndex, value);
  }

  //添加行
  addRows(rowsIndex: number) {
    if (this.question.children) this.questionnaire.addRows(this.index, rowsIndex, this.question.children.length + 1);
  }

  //移动行
  moveRows(rowsIndex: number, action: string) {
    if (rowsIndex == 0 && action == "上") return;
    this.questionnaire.moveRows(this.index, rowsIndex, action);
  }

  //删除行
  removeRows(rowsIndex: number) {
    if (this.question.children && this.question.children.length > 1) {
      this.questionnaire.removeRows(this.index, rowsIndex);
    } else {
      this.message.warning("不能删除所有行");
    }
  }

  //添加列
  addColumn = (columnIndex: number) => {
    if (this.question.option.length < 5) {
      this.questionnaire.optionAdd(this.index, columnIndex);
    } else {
      this.message.warning("最多只能添加5行");
    }
  };
}
