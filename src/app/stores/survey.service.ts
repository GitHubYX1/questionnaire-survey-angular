import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import cloneDeep from "lodash.clonedeep";
import type { surveyType } from "app/types/index";
import storage from "app/utils/storage";

const ids = localStorage.getItem("SURVEYID") || "";

@Injectable({
  providedIn: "root"
})
export class SurveyService {
  surveyData: surveyType[] = storage.getSession("SURVEYDATA") || [];
  // surveyId: string = localStorage.getItem("SURVEYID") || "";
  private idSubject = new BehaviorSubject<string>(ids);
  surveyId$ = this.idSubject.asObservable();
  get surveyId(): string {
    return this.idSubject.value;
  }

  set surveyId(value: string) {
    this.idSubject.next(value);
  }
  /**获取调查*/
  surveySelected(id: string): surveyType {
    return cloneDeep(this.surveyData.filter(item => item.id === id)[0]);
  }
  /**新增调查*/
  surveyAdd(survey: surveyType) {
    this.surveyData.unshift(survey);
    storage.setSession("SURVEYDATA", this.surveyData);
  }
  /**调查修改*/
  surveyModify(survey: surveyType) {
    const index = this.surveyData.findIndex(item => {
      return item.id === survey.id;
    });
    this.surveyData[index] = survey;
    storage.setSession("SURVEYDATA", this.surveyData);
  }
  /**状态修改*/
  stateModify(id: string, state: boolean) {
    this.surveyData.forEach(item => {
      if (item.id == id) item.state = state;
    });
    storage.setSession("SURVEYDATA", this.surveyData);
  }
  /**调查删除*/
  surveyErasure(id: string) {
    this.surveyData = this.surveyData.filter(item => item.id !== id);
    storage.setSession("SURVEYDATA", this.surveyData);
  }
  // 修改调查id
  modifySurveyId(id: string) {
    this.surveyId = id;
    localStorage.setItem("SURVEYID", id);
  }
}
