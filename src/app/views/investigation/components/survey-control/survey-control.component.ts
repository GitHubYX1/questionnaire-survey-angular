import { Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { NgFor } from "@angular/common";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { contrlList } from "assets/common/local-data";
import { SurveyUploadComponent } from "../survey-upload/survey-upload.component";
import { typeEnum } from "assets/common/enums";
import type { questionType, contrlChildrenType } from "app/types";

@Component({
  selector: "survey-control",
  imports: [NzButtonModule, NzIconModule, NgFor, SurveyUploadComponent],
  templateUrl: "./survey-control.component.html",
  styleUrl: "./survey-control.component.scss"
})
export class SurveyControlComponent {
  @Input() questionMaxId = 1000;
  contrlData = contrlList;
  @ViewChild("SurveyUploadComponent") surveyUpload = SurveyUploadComponent;
  @Output() deriveContrl = new EventEmitter<{ title: string; type: typeEnum }>();
  @Output() uploadData = new EventEmitter<{ question: questionType[]; radio: string }>();

  download() {
    window.open("问卷模板.xlsx");
  }
  clickControl(contrl: contrlChildrenType) {
    this.deriveContrl.emit({ title: contrl.title, type: contrl.type });
  }
}
