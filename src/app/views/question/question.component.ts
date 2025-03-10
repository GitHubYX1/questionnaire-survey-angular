import { Component, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgIf, NgFor, NgSwitch, CommonModule } from "@angular/common";
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, FormGroup } from "@angular/forms";
import shortId from "shortid";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzRateModule } from "ng-zorro-antd/rate";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { SliderItemComponent } from "app/components/slider-item/slider-item.component";
import { MatrixItemComponent } from "app/components/matrix-item/matrix-item.component";
import type { questionType, answerType, surveyAnswerType, QuestionControlType, optionType, questionListType } from "app/types";
import { SurveyService } from "app/stores/survey.service";
import { getTime, timeDiff } from "app/utils";
import { isMobile, isIdCard, isEmail, isQQ, isTel, isNumber, isInteger } from "app/utils/validate";
import { answerSave, answerSelected } from "app/computed/answer";
import { typeEnum, validateEnum } from "assets/common/enums";

const fillValidateMap = {
  [validateEnum.ID_CARD]: { msg: "请输入正确的身份证号", fn: isIdCard },
  [validateEnum.MOBILE]: { msg: "请输入正确的手机号", fn: isMobile },
  [validateEnum.TEL]: { msg: "请输入正确的固话号码", fn: isTel },
  [validateEnum.NUMBER]: { msg: "请输入数字", fn: isNumber },
  [validateEnum.INTEGER]: { msg: "请输入正整数", fn: isInteger },
  [validateEnum.QQ]: { msg: "请输入正确的QQ号", fn: isQQ },
  [validateEnum.EMAIL]: { msg: "请输入正确的邮箱", fn: isEmail }
};

const questionItem = document.getElementsByClassName("question-item"); //获取题目元素

const { RADIO, CHECKBOX, DROP, SCORE, FILL, PAGING, PARAGRAPH, SLIDER, MATRIX_RADIO, MATRIX_CHECKBOX, MATRIX_SLIDER } = typeEnum;

@Component({
  selector: "app-question",
  imports: [
    NgIf,
    NgFor,
    NgSwitch,
    CommonModule,
    ReactiveFormsModule,
    NzSkeletonModule,
    NzFormModule,
    NzRadioModule,
    NzCheckboxModule,
    NzSelectModule,
    NzRateModule,
    NzInputModule,
    NzButtonModule,
    MatrixItemComponent,
    SliderItemComponent
  ],
  templateUrl: "./question.component.html",
  styleUrl: "./question.component.scss"
})
export class QuestionComponent {
  @Input() preview = false;
  title = "";
  content = "";
  id = "";
  startTime = "";
  pageIndex = 0;
  answerIdRef = "";
  questionData: questionListType[][] = [];
  controlData: QuestionControlType[] = [];
  optionLogic: QuestionControlType[] = [];
  formState: FormGroup = this.fb.record({});
  typeEnum = typeEnum;

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private surveyStore: SurveyService,
    private message: NzMessageService,
    private fb: NonNullableFormBuilder
  ) {}
  ngOnInit() {
    let surveyId: string = this.routerInfo.snapshot.queryParams["id"];
    let answerId: string = this.routerInfo.snapshot.queryParams["answerId"];
    console.log("surveyId", surveyId, answerId);
    if (surveyId) {
      let survey = this.surveyStore.surveySelected(surveyId);
      if (!survey) {
        this.message.error("问卷不存在或问卷已删除");
        return;
      } else if (!survey.state && !this.preview) {
        this.message.error("当前问卷已暂停，请稍后重试！");
        return;
      }
      this.title = survey.title;
      this.content = survey.content;
      this.id = survey.id;
      //获取逻辑
      this.controlData = survey.controlLogic.map(item => ({
        id: item.childId,
        parentIds: item.questionIds.split(",").map((item: string) => Number(item)),
        condition: item.condition,
        parentAnswer: item.parentAnswer.split("|").map((item: string) => item.split(",").map(id => Number(id)))
      }));
      this.optionLogic =
        survey.controlOption.map(item => ({
          id: item.childId,
          parentIds: item.questionIds.split(",").map((item: string) => Number(item)),
          condition: item.condition,
          optionId: item.optionId,
          parentAnswer: item.parentAnswer.split("|").map((item: string) => item.split(",").map(id => Number(id)))
        })) || [];
      this.startTime = getTime();
      // 获取题目列表
      const questionLsit: questionListType[][] = [[]];
      let page = 0;
      const json: any = {};
      survey.question.forEach(item => {
        if (item.isHide !== 1) {
          if (item.type !== PAGING) {
            const show = this.isQuestionVisible(item.id, this.controlData);
            const hideNum = this.isOptionVisible(item.id, this.optionLogic);
            const isVisible = show && (hideNum.length === 0 ? true : hideNum.length !== item.option.length);
            questionLsit[page].push({
              ...item,
              isVisible: isVisible,
              hideNum
            });
          } else {
            page++;
            questionLsit.push([]);
          }
        }
      });
      const questionData = questionLsit.filter(item => item.length !== 0);
      questionData[0].forEach(item => {
        if (item.title !== PARAGRAPH && item.isVisible) {
          if (item.children && item.children?.length !== 0) {
            for (let son of item.children) {
              json[son.id] = [null, this.rulesValidate(item)];
            }
          } else {
            json[item.id] = [null, this.rulesValidate(item)];
          }
        }
      });
      this.formState = this.fb.record(json);
      this.questionData = questionData;
      //判断是否有有答案
      if (answerId) {
        this.answerIdRef = answerId;
        let answer = answerSelected(surveyId, answerId);
        if (!answer) {
          this.message.error("未找到相关答案");
          return;
        }
        for (let item of answer.answer) {
          const son = survey.question.find(son => {
            if (son.children && son.children?.length !== 0) {
              for (const son2 of son.children) {
                if (son2.id === item.questionId) {
                  return true;
                }
              }
              return false;
            } else {
              return son.id === item.questionId;
            }
          });
          this.formState.addControl(String(item.questionId), this.fb.control(null, this.rulesValidate(son)));
          this.formState.patchValue({
            [item.questionId]: item.content
          });
          this.changeAnswer(item.questionId, item.content);
        }
      }
    } else {
      this.message.error("没有获取到调查");
    }
  }
  // 验证规则
  rulesValidate(item: questionType | undefined): any {
    return item?.must
      ? [
          (control: FormControl) => {
            const value = control.value;
            if ((!value && value !== 0) || (Array.isArray(value) && value.length === 0)) {
              return { requiredError: "请完成该评价" };
            }
            if (typeof value === "string" && item.validateType !== validateEnum.DEFAULT) {
              const fvm = fillValidateMap[item.validateType];
              if (fvm && !fvm.fn(value)) {
                return { requiredError: fvm.msg };
              }
            }
            if (Array.isArray(value)) {
              if (item.chooseMin !== 0 && value.length < item.chooseMin) {
                return { requiredError: `最少选择${item.chooseMin}项` };
              }
              if (item.chooseMax !== 0 && value.length > item.chooseMax) {
                return { requiredError: `最多选择${item.chooseMax}项` };
              }
            }
            return null;
          }
        ]
      : [];
  }

  nzErrorTip(id: number) {
    return this.formState.get(String(id))?.errors?.["requiredError"] || "";
  }
  // 是否显示题目
  isQuestionVisible(id: number, control: QuestionControlType[]) {
    const findControl = control.find(item => item.id === id);
    if (findControl) {
      const form = this.formState.value;
      let logicList: boolean[] = [];
      findControl.parentIds.forEach((parentId, index) => {
        const answer = findControl.parentAnswer[index];
        logicList.push(
          answer.some(item => {
            return Array.isArray(form[parentId]) ? form[parentId].includes(item) : form[parentId] == item;
          })
        );
      });
      return findControl.condition === "or" ? logicList.some(item => item) : logicList.every(item => item);
    }

    return true;
  }

  // 是否显示选项
  isOptionVisible(id: number, logic: QuestionControlType[]) {
    const filterOption = logic.filter(item => item.id === id);
    const optionShow: number[] = [];
    // 选择控制逻辑处理
    if (filterOption.length) {
      const form = this.formState.value;
      filterOption.forEach(item => {
        for (const i in item.parentIds) {
          const parentId = item.parentIds[i];
          const answer = item.parentAnswer[i];
          const logicSome = answer.some(item => {
            return Array.isArray(form[parentId]) ? form[parentId].includes(item) : form[parentId] == item;
          });
          if (!logicSome && item.optionId) optionShow.push(item.optionId);
        }
      });
    }
    return optionShow;
  }
  // 更改答案
  changeAnswer(id: number, value: string | number | number[]) {
    const childControl = this.controlData.filter(item => item.parentIds.includes(id));
    const filterOption = this.optionLogic.filter(item => item.parentIds.includes(id));
    if (childControl.length || filterOption.length) {
      const form = this.formState.value;
      this.questionData.forEach((item, index) => {
        item.forEach(item2 => {
          const show = this.isQuestionVisible(item2.id, childControl);
          const hideNum = this.isOptionVisible(item2.id, filterOption);
          const optionShow = hideNum.length === 0 || hideNum.length !== item2.option.length;
          if (!show || !optionShow) {
            if (!item2.children || item2.children.length === 0) {
              this.formState.removeControl(String(item2.id));
            } else {
              for (const son of item2.children) {
                this.formState.removeControl(String(son.id));
              }
            }
          } else if (hideNum.length && form[item2.id] !== undefined) {
            let formId = form[item2.id];
            formId = Array.isArray(formId) ? formId.filter(item => !hideNum.includes(item)) : !hideNum.includes(formId) ? form : "";
            this.formState.value[item2.id] = formId;
          }
          const isVisible = show && optionShow;
          if (!item2.isVisible && isVisible && index === this.pageIndex) {
            if (item2.children && item2.children?.length !== 0) {
              for (let son of item2.children) {
                this.formState.addControl(String(son.id), this.fb.control(null, this.rulesValidate(item2)));
              }
            } else {
              this.formState.addControl(String(item2.id), this.fb.control(null, this.rulesValidate(item2)));
            }
          }
          item2.isVisible = isVisible;
          item2.hideNum = hideNum;
        });
      });
    }
  }

  // 选项筛选
  filterAnswer(hideNum: number[] | undefined, option: optionType[]) {
    if (hideNum?.length) {
      return option.filter(item => !hideNum.includes(item.id));
    } else {
      return option;
    }
  }
  // 矩阵显示
  matrixOptionShow(type: typeEnum) {
    return [MATRIX_RADIO, MATRIX_CHECKBOX, MATRIX_SLIDER].includes(type);
  }
  //获取列数
  generateColumn(column: number) {
    return { "grid-template-columns": `repeat(${column}, minmax(0, 1fr))` };
  }

  //上一页
  prevPage() {
    this.nextPage("prev");
  }

  //分页
  nextPage(type: "next" | "prev" = "next") {
    type === "next" ? this.pageIndex++ : this.pageIndex--;
    if (this.isPageEmpty(this.questionData[this.pageIndex])) {
      this.nextPage(type);
      return;
    }
    if (type === "next") {
      this.questionData[this.pageIndex].map(item => {
        if (item.title !== PARAGRAPH && item.isVisible) {
          if (item.children && item.children?.length !== 0) {
            for (let son of item.children) {
              this.formState.addControl(String(son.id), this.fb.control(null, this.rulesValidate(item)));
            }
          } else {
            this.formState.addControl(String(item.id), this.fb.control(null, this.rulesValidate(item)));
          }
        }
      });
    } else {
      for (const i in this.formState.value) {
        if (this.formState.value[i] === null) {
          this.formState.removeControl(i);
        }
      }
    }
    questionItem[0].scrollIntoView({ behavior: "smooth" });
  }
  //判断当前是否为空
  isPageEmpty(question: questionListType[]) {
    return question.filter(item => item.isVisible).length === 0;
  }

  submitTo(isSubmit: boolean) {
    if (this.formState.valid) {
      if (!isSubmit) {
        this.nextPage("next");
        return;
      }

      let answerData: answerType[] = [];
      let formData = this.formState.value;
      for (let i in formData) {
        if (formData[i] !== null) answerData.push({ questionId: Number(i), content: formData[i] });
      }
      if (this.preview) {
        this.message.error("此问卷为预览状态，不能提交！");
        return;
      }
      let endTime = getTime();
      let surveyAnswerData: surveyAnswerType = {
        answerId: "answer-" + shortId.generate(),
        surveyId: this.id,
        surveyTitle: this.title,
        startTime: this.startTime,
        endTime: endTime,
        consumTime: timeDiff(this.startTime, endTime),
        answer: answerData
      };
      answerSave(surveyAnswerData);
      const data = this.router.navigate(["/question/success"]);
    } else {
      Object.values(this.formState.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
