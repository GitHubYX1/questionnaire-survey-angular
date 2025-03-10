import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FormControl, FormRecord, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgIf, NgFor } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzMessageService } from "ng-zorro-antd/message";
import type { optionType, questionType, controlLogicType } from "app/types";

interface concernType {
  value: number;
  id: number;
  option: optionType[];
}

@Component({
  selector: "concern-select",
  imports: [FormsModule, NgIf, NgFor, NzFormModule, NzSelectModule, NzButtonModule, NzCheckboxModule, NzRadioModule, ReactiveFormsModule],
  templateUrl: "./concern-select.component.html",
  styleUrl: "./concern-select.component.scss"
})
export class ConcernSelectComponent {
  @Input() childId: number = 0;
  @Input() options: questionType[] = [];
  @Input() control: controlLogicType | undefined;
  @Input() showAdd: boolean = true;
  @Input() optionId: number | undefined;
  formFront: FormRecord<any> = this.fb.record({});

  concernData: concernType[] = [{ value: 0, id: 0, option: [] }];
  conditionValue: "and" | "or" = "and";

  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    if (this.control) {
      this.conditionValue = this.control.condition;
      let questionIds = this.control.questionIds.split(",").map(item => Number(item));
      let parentAnswer = this.control.parentAnswer.split("|").map((item: string) => item.split(",").map(id => Number(id)));
      let concernList: concernType[] = this.options.flatMap(item => (questionIds.indexOf(item.id) !== -1 ? { value: item.id, id: item.id, option: item.option } : []));
      for (let i in questionIds) {
        this.formFront.addControl(String(questionIds[i]), new FormControl(parentAnswer[i]));
      }
      this.concernData = concernList;
      for (let i in questionIds) {
      }
    }
  }
  //判断是否禁用该选项
  disabledMethod(id: number, vlaue: number) {
    let disabled = this.concernData.find(item => item.id === id) !== undefined;
    if (vlaue === id) disabled = false;
    return disabled;
  }
  //选择数据
  select(index: number, value: number) {
    if (this.concernData[index].id === value) return;
    let ids = this.concernData.map(item => item.id).indexOf(value);
    if (ids !== -1) {
      this.concernData[index].value = this.concernData[index].id || 0;
      this.message.info("关联题目不能重复");
      return;
    }
    let data = this.options.find(item => item.id == value);
    const id = this.concernData[index].id;
    this.concernData[index].id = value;
    this.concernData[index].option = data?.option || [];

    // 动态更新 formFront
    this.formFront.addControl(String(value), new FormControl([]));
    this.formFront.removeControl(String(id));
  }
  //反选
  invert(index: number, id: number) {
    let option = this.concernData[index].option;
    let front = this.formFront.value[id];
    if (!front || front.length == 0) {
      front = option.map(item => item.id);
    } else {
      front = option.filter(item => front.indexOf(item.id) === -1).map(item => item.id);
    }
    this.formFront.patchValue({
      [id]: front
    });
  }
  //新增
  frontAdd() {
    if (this.concernData.length == this.options.length) {
      this.message.info("已超过可关联题目数量！");
      return;
    }
    this.concernData.push({
      value: 0,
      id: this.concernData.length + 1,
      option: []
    });
  }
  //取消
  frontCancel(index: number, id: number) {
    this.concernData.splice(index, 1);
    this.formFront.removeControl(String(id));
  }
  //全部删除
  deleteAll() {
    this.concernData = [{ value: 0, id: 0, option: [] }];
    this.formFront.reset();
  }
  //获取选中的选项
  static getConcern(): controlLogicType {
    throw new Error("方法未实现。");
  }
  //确定
  getConcern(): controlLogicType {
    let ids: string[] = [];
    let parentAnswer = [];
    let from = this.formFront.value;
    for (let i in from) {
      if (from[i] && from[i].length) {
        ids.push(i);
        parentAnswer.push(from[i].join(","));
      }
    }
    const controlLogic: controlLogicType = {
      questionIds: ids.join(),
      childId: this.childId,
      parentAnswer: parentAnswer.join("|"),
      condition: this.conditionValue
    };
    if (this.optionId !== undefined) controlLogic.optionId = this.optionId;
    return controlLogic;
  }
}
