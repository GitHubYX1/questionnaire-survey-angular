import { Component, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIf, NgFor } from "@angular/common";
import dayjs from "dayjs";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzMessageService } from "ng-zorro-antd/message";
import type { questionType, optionType, answerType } from "app/types";
import { SurveyService } from "app/stores/survey.service";
import { typeEnum } from "assets/common/enums";

const { PAGING, PARAGRAPH, FILL, SLIDER, MATRIX_SLIDER } = typeEnum;
const noConcernItem = [PAGING, PARAGRAPH, FILL, SLIDER, MATRIX_SLIDER];
const dateFormat = "YYYY-MM-DD";

interface screenType {
  value: number;
  id: number;
  option: optionType[];
  answer: number[];
}

@Component({
  selector: "screen-item",
  imports: [FormsModule, NgIf, NgFor, NzIconModule, NzRadioModule, NzButtonModule, NzDatePickerModule, NzSelectModule],
  templateUrl: "./screen-item.component.html",
  styleUrl: "./screen-item.component.scss"
})
export class ScreenItemComponent {
  screenShow = true;
  conditionValue = "and";
  date: Date[] = [];
  screenQuestion: questionType[] = [];
  screenData: screenType[] = [];
  @Output() screenChange = new EventEmitter<{ date: string[]; condition: string; answer: answerType[] }>();

  constructor(
    public surveyStore: SurveyService,
    private message: NzMessageService
  ) {
    this.surveyStore.surveyId$.subscribe(newData => {
      const survey = this.surveyStore.surveySelected(newData);
      const questionList: questionType[] = [];
      for (const item of survey.question) {
        if (!noConcernItem.includes(item.type)) {
          if (item.children && item.children.length) {
            for (const child of item.children) {
              child.title = item.title + "-" + child.title;
              questionList.push(child);
            }
          } else {
            questionList.push(item);
          }
        }
      }
      this.screenQuestion = questionList;
      this.screenData = [];
      this.conditionValue = "and";
      this.screenShow = true;
    });
  }
  //增加条件
  addCondition() {
    if (this.screenData.length === this.screenQuestion.length) {
      this.message.info("已超过可关联题目数量！");
      return;
    }
    this.screenData.push({
      value: 0,
      id: this.screenData.length + 1,
      option: [],
      answer: []
    });
  }
  // 删除条件
  removeCondition(index: number) {
    this.screenData.splice(index, 1);
  }
  //判断是否禁用该选项
  disabledMethod(id: number, vlaue: number) {
    let disabled = this.screenData.find(item => item.id === id) !== undefined;
    if (vlaue === id) disabled = false;
    return disabled;
  }
  //选择数据
  ngModelChange(index: number, value: number) {
    if (this.screenData[index].id === value) return;
    let ids = this.screenData.map(item => item.id).indexOf(value);
    if (ids !== -1) {
      this.screenData[index].value = this.screenData[index].id;
      this.message.info("关联题目不能重复");
      return;
    }
    let data = this.screenQuestion.find(item => item.id == value);
    this.screenData[index].id = value;
    this.screenData[index].option = data?.option || [];
  }
  //重置
  reset() {
    this.date = [];
    this.screenData = [];
    this.conditionValue = "and";
  }
  //点击查询
  screenClick() {
    const dateInfo = ["", ""];
    this.screenData = this.screenData.filter(item => item.answer.length > 0);
    const answer: answerType[] = this.screenData.map(item => ({ questionId: item.id, content: item.answer }));
    if (this.date[0]) {
      const time = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss").split(" ");
      const dateData = [dayjs(this.date[0]).format(dateFormat), dayjs(this.date[1]).format(dateFormat)];
      let end = "23:59:59";
      dateInfo[0] = dateData[0] + " 00:00:00";
      if (time[0] == dateData[1]) {
        end = time[1];
      }
      dateInfo[1] = dateData[1] + " " + end;
    }
    this.screenChange.emit({
      date: dateInfo,
      condition: this.conditionValue,
      answer
    });
  }
}
