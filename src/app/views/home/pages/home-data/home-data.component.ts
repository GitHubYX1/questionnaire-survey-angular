import { Component } from "@angular/core";
import { NgFor } from "@angular/common";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzButtonModule } from "ng-zorro-antd/button";
import { UserService } from "app/stores/user.service";
import { SurveyService } from "app/stores/survey.service";
import { getAnswerNum, getAnswerData } from "app/computed/answer";

@Component({
  selector: "app-home-data",
  imports: [NgFor, NzAvatarModule, NzCardModule, NzTableModule, NzButtonModule],
  templateUrl: "./home-data.component.html",
  styleUrl: "./home-data.component.scss"
})
export class HomeDataComponent {
  getAnswerNum = getAnswerNum;
  answerData = getAnswerData();
  constructor(
    public userStore: UserService,
    public surveyStore: SurveyService
  ) {}
  editClick(surveyId: string, answerId: string) {
    window.open(`#/preview?id=${surveyId}&answerId=${answerId}`, "_blank");
  }
}
