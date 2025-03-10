import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";
import shortId from "shortid";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzModalService, NzModalModule } from "ng-zorro-antd/modal";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { SurveyService } from "app/stores/survey.service";
import { getAnswerNum, answerErasure } from "app/computed/answer";
import { getTime } from "app/utils/index";
import type { surveyType } from "app/types";

@Component({
  selector: "app-project",
  imports: [FormsModule, NgFor, NgIf, NzButtonModule, NzSelectModule, NzInputModule, NzIconModule, NzEmptyModule, NzSwitchModule, NzModalModule],
  templateUrl: "./project.component.html",
  styleUrl: "./project.component.scss"
})
export class ProjectComponent {
  stateValue: boolean | "" = "";
  searchValue = "";
  surveyList: surveyType[] = [];
  constructor(
    public surveyStore: SurveyService,
    private router: Router,
    private modal: NzModalService
  ) {}
  ngOnInit() {
    this.surveyList = this.surveyStore.surveyData;
  }
  //跳转调查页
  pushInvestigation(id = "") {
    this.router.navigate(["/investigation"]);
    this.surveyStore.modifySurveyId(id);
  }
  getAnswerNumProject(id: string) {
    return getAnswerNum(id);
  }
  //答题
  answer = (id: string) => {
    window.open("#/question?id=" + id, "_blank");
  };

  dataAnalysis(id: string) {
    this.router.navigate(["/data/analysis"]);
    this.surveyStore.modifySurveyId(id);
  }
  //复制
  copyClick(item: surveyType) {
    let survey = JSON.parse(JSON.stringify(item));
    survey.id = shortId.generate();
    survey.title = survey.title + "【复制】";
    survey.createTime = getTime();
    survey.modifyTime = "";
    survey.state = false;
    this.surveyStore.surveyAdd(survey);
  }

  //删除
  erasure(id: string) {
    this.modal.confirm({
      nzTitle: "提示",
      nzContent: `删除该调查？`,
      nzOkText: "确认",
      nzCancelText: "取消",
      nzOnOk: () => {
        this.surveyList = this.surveyList.filter(item => item.id !== id);
        this.surveyStore.surveyErasure(id);
        answerErasure(id);
      }
    });
  }
  //切换状态
  stateChange(id: string, state: boolean) {
    this.surveyStore.stateModify(id, state);
  }
  onScreen() {
    this.surveyList = this.surveyStore.surveyData.filter(item => item.title.indexOf(this.searchValue) != -1 && (this.stateValue !== "" ? item.state == this.stateValue : true));
  }
}
