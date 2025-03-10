import { Component, ViewChild } from "@angular/core";
import { NgIf, NgFor } from "@angular/common";
import { Router } from "@angular/router";
import shortId from "shortid";
import cloneDeep from "lodash.clonedeep";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzMessageService } from "ng-zorro-antd/message";
import { QuestionnaireService } from "app/stores/questionnaire.service";
import { SurveyService } from "app/stores/survey.service";
import { getTime } from "app/utils";
import type { surveyType, questionType } from "app/types";
import { SurveyControlComponent } from "./components/survey-control/survey-control.component";
import { EditorUploadComponent } from "./components/editor-title/editor-title.component";
import { SurveyItemComponent } from "./components/survey-item/survey-item.component";
import { BatchAddComponent } from "./components/batch-add/batch-add.component";
import { ConcernFrontComponent } from "./components/concern-front/concern-front.component";
import { ConcernCopyComponent } from "./components/concern-copy/concern-copy.component";
import { ConcernOptionComponent } from "./components/concern-option/concern-option.component";
import { typeEnum } from "assets/common/enums";

const serialRemoveType = [typeEnum.PARAGRAPH, typeEnum.PAGING];
const noConcernItem = [typeEnum.FILL, typeEnum.SLIDER, typeEnum.MATRIX_RADIO, typeEnum.MATRIX_CHECKBOX, typeEnum.MATRIX_SLIDER];

@Component({
  selector: "app-investigation",
  imports: [
    NgIf,
    NgFor,
    NzToolTipModule,
    NzIconModule,
    NzButtonModule,
    NzEmptyModule,
    SurveyControlComponent,
    EditorUploadComponent,
    SurveyItemComponent,
    BatchAddComponent,
    ConcernFrontComponent,
    ConcernCopyComponent,
    ConcernOptionComponent
  ],
  templateUrl: "./investigation.component.html",
  styleUrl: "./investigation.component.scss"
})
export class InvestigationComponent {
  @ViewChild("EditorUploadComponent") editorUpload = EditorUploadComponent;
  @ViewChild("BatchAddComponent") batchModal = BatchAddComponent;
  @ViewChild("ConcernFrontComponent") concernFront = ConcernFrontComponent;
  @ViewChild("ConcernCopyComponent") concernCopy = ConcernCopyComponent;
  @ViewChild("ConcernOptionComponent") concernOption = ConcernOptionComponent;
  constructor(
    private router: Router,
    private surveyStore: SurveyService,
    public questionnaire: QuestionnaireService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}
  ngOnInit() {
    const surveyId = this.surveyStore.surveyId;
    const maxId = localStorage.getItem("MAXID");
    if (surveyId) {
      let survey = this.surveyStore.surveySelected(surveyId);
      if (survey) {
        //获取首次数据
        this.questionnaire.init(survey, maxId);
      } else {
        this.surveyStore.modifySurveyId("");
      }
    } else {
      this.questionnaire.reset();
    }
  }
  //批量增加选项
  batchOption(e: { index: number; text: string }) {
    this.batchModal.batchOpen(e.index, e.text);
  }
  //题目关联
  concern(e: { index: number; id: number; title: string; state: number }) {
    const { index, id, title, state } = e;
    const question: questionType[] = cloneDeep(this.questionnaire.question);
    const controlLogic = this.questionnaire.controlLogic.find(item => item.childId === id);
    switch (state) {
      case 1:
        const data = question
          .slice(0, index)
          .filter(item => !serialRemoveType.includes(item.type))
          .map((item, index) => ({ ...item, title: index + 1 + "." + item.title }))
          .filter(item => !noConcernItem.includes(item.type));
        if (data.length === 0) {
          this.message.info("此题前面没有选项题，无法设置关联逻辑！");
          return;
        }
        this.concernFront.frontOpen(data, title, id, controlLogic);
        return;
      case 2:
        if (!controlLogic) {
          this.message.info("此题没有关联逻辑，无法复制！");
          return;
        }
        const data2 = question.slice(index + 1).filter(item => item.type !== typeEnum.PAGING);
        this.concernCopy.copyOpen(data2, title, id, controlLogic);
        return;
      case 3:
        const data3 = question
          .slice(0, index)
          .filter(item => !serialRemoveType.includes(item.type))
          .map((item, index) => ({ ...item, title: index + 1 + "." + item.title }))
          .filter(item => !noConcernItem.includes(item.type));
        if (data3.length === 0) {
          this.message.info("此题前面没有选项题，无法设置关联逻辑！");
          return;
        }
        const controlOption = this.questionnaire.controlOption?.filter(item => item.childId === id);
        this.concernOption.optionOpen(data3, title, question[index].option, id, controlOption);
        return;
      default:
        return;
    }
  }
  //显示关联
  showConcern(id: number) {
    const controlLogic = this.questionnaire.controlLogic.find(item => item.childId === id);
    return this.questionnaire.logicText(controlLogic);
  }
  //获取当前项的选项关联
  optionLogic(id: number) {
    return this.questionnaire.controlOption.filter(item => item.childId === id);
  }
  //返回
  goBack() {
    this.questionnaire.reset();
    this.router.navigate(["/project"]);
  }
  // 预览
  previewClick() {
    if (this.questionnaire.id) {
      this.router.navigate(["/preview"], { queryParams: { id: this.questionnaire.id } });
    } else {
      this.modal.warning({
        nzTitle: "提示",
        nzContent: "当前问卷未保存"
      });
    }
  }
  //保存
  save(state: boolean) {
    if (this.questionnaire.question.length == 0) {
      this.modal.warning({
        nzTitle: "提示",
        nzContent: "当前问卷没有题目"
      });
      return;
    }
    this.questionnaire.state = state ? state : this.questionnaire.state;
    const survey: surveyType = {
      id: this.questionnaire.id,
      title: this.questionnaire.title,
      content: this.questionnaire.content,
      createTime: this.questionnaire.createTime,
      modifyTime: this.questionnaire.modifyTime,
      state: this.questionnaire.state,
      question: this.questionnaire.question,
      controlLogic: this.questionnaire.controlLogic,
      controlOption: this.questionnaire.controlOption
    };
    console.log("survey", survey);
    if (this.questionnaire.id == "") {
      survey.id = shortId.generate();
      this.questionnaire.id = survey.id;
      survey.createTime = getTime();
      this.questionnaire.createTime = survey.createTime;
      this.surveyStore.surveyAdd(survey);
    } else {
      survey.modifyTime = getTime();
      this.questionnaire.modifyTime = survey.modifyTime;
      this.surveyStore.surveyModify(survey);
    }
    localStorage.setItem("MAXID", String(this.questionnaire.questionMaxId));
    this.surveyStore.modifySurveyId(this.questionnaire.id);
    this.message.success("保存成功！");
    if (state) {
      this.questionnaire.reset();
      this.router.navigate(["/project"]);
    }
  }
}
