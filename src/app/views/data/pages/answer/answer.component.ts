import { Component } from "@angular/core";
import { NgIf, NgFor } from "@angular/common";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { ScreenItemComponent } from "../../components/screen-item/screen-item.component";
import { SurveyService } from "app/stores/survey.service";
import { processAnswerData } from "app/computed/api";
import { answerErasure } from "app/computed/answer";
import type { surveyAnswerType, answerType } from "app/types";
import * as Excel from "exceljs";
import { saveAs } from "file-saver";

@Component({
  selector: "app-answer",
  imports: [NgIf, NgFor, NzCardModule, ScreenItemComponent, NzButtonModule, NzIconModule, NzTableModule, NzToolTipModule, NzPopconfirmModule],
  templateUrl: "./answer.component.html",
  styleUrl: "./answer.component.scss"
})
export class AnswerComponent {
  answerData: surveyAnswerType[] = [];
  excleData: string[][] = [];
  exeleQuestion: string[][] = [];
  date: string[] = [];
  conditionValue = "and";
  screenAnswer: answerType[] = [];
  loading = false;
  exportLoading = false;
  constructor(public surveyStore: SurveyService) {
    this.surveyStore.surveyId$.subscribe(async () => {
      this.conditionValue = "and";
      this.screenAnswer = [];
      await this.getData();
    });
  }

  async getData() {
    this.loading = true;
    let { answer, excleList, questionList } = await processAnswerData(this.surveyStore.surveyId, this.date, this.conditionValue, this.screenAnswer);
    this.answerData = answer;
    this.excleData = excleList;
    this.exeleQuestion = questionList;
    this.loading = false;
  }

  async screenChange(query: { date: string[]; condition: string; answer: answerType[] }) {
    this.date = query.date;
    this.conditionValue = query.condition;
    this.screenAnswer = query.answer;
    await this.getData();
  }

  //查看
  editClick(surveyId: string, answerId: string) {
    window.open(`#/preview?id=${surveyId}&answerId=${answerId}`, "_blank");
  }
  async courseDelete(surveyId: string, answerId: string) {
    answerErasure(surveyId, answerId);
    await this.getData();
  }

  //下载答案
  download() {
    this.exportLoading = true;
    const workbook = new Excel.Workbook();
    //数据详情
    const sheet = workbook.addWorksheet("数据详情");
    sheet.addRows(this.excleData);
    sheet.eachRow(row => {
      //修改行
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
        sheet.getColumn(colNumber).width = 20; // 设置列宽
        cell.alignment = { horizontal: "center" }; // 居中
      });
    });
    //题目列表
    const sheet2 = workbook.addWorksheet("题目列表");
    sheet2.addRows(this.exeleQuestion);
    sheet2.eachRow(row => {
      //修改行
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
        if (colNumber === 1) {
          sheet2.getColumn(colNumber).width = 10;
        } else if (colNumber === 2) {
          sheet2.getColumn(colNumber).width = 40;
        } else if (colNumber === 3) {
          sheet2.getColumn(colNumber).width = 15;
        } else {
          sheet2.getColumn(colNumber).width = 30;
        }

        cell.alignment = { horizontal: "center" }; // 居中
      });
    });
    // 导出文档
    workbook.xlsx.writeBuffer().then(buffer => {
      const data = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
      });
      saveAs(data, this.answerData[0].surveyTitle + ".xlsx");
      this.exportLoading = false;
    });
  }
}
