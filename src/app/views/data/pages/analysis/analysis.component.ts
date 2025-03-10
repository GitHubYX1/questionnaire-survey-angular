import { Component, ViewChild } from "@angular/core";
import { NgIf, NgFor } from "@angular/common";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";
import docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import { ScreenItemComponent } from "../../components/screen-item/screen-item.component";
import { AnalysisTableComponent } from "../../components/analysis-table/analysis-table.component";
import { CheckTextComponent } from "../../components/check-text/check-text.component";
import { SurveyService } from "app/stores/survey.service";
import { processAnalysisData, onFill } from "app/computed/api";
import type { analysisType, answerType } from "app/types";
import { typeEnum } from "assets/common/enums";

@Component({
  selector: "app-analysis",
  imports: [NgIf, NgFor, NzCardModule, NzSkeletonModule, NzIconModule, NzButtonModule, ScreenItemComponent, AnalysisTableComponent, CheckTextComponent],
  templateUrl: "./analysis.component.html",
  styleUrl: "./analysis.component.scss"
})
export class AnalysisComponent {
  loading = true;
  downloadLoading = false;
  titleText = "";
  assessCount = 0;
  startTime = "";
  endTime = "";
  topicData: analysisType[] = [];
  date: string[] = [];
  conditionValue = "and";
  screenAnswer: answerType[] = [];
  typeEnum = typeEnum;
  onFill = onFill;
  @ViewChild("CheckTextComponent") checkText = CheckTextComponent;

  constructor(public surveyStore: SurveyService) {
    this.surveyStore.surveyId$.subscribe(async newData => {
      this.conditionValue = "and";
      this.screenAnswer = [];
      await this.queryData();
    });
  }

  async queryData() {
    this.loading = true;
    let { title, count, start, end, data } = await processAnalysisData(this.surveyStore.surveyId, this.date, this.conditionValue, this.screenAnswer);
    this.titleText = title;
    this.assessCount = count;
    this.topicData = data;
    this.startTime = start;
    this.endTime = end;
    this.loading = false;
  }
  //筛选
  async screenChange(query: { date: string[]; condition: string; answer: answerType[] }) {
    this.date = query.date;
    this.conditionValue = query.condition;
    this.screenAnswer = query.answer;
    await this.queryData();
  }
  //查看填空题答案
  lookInfo(item: analysisType) {
    this.checkText.open(item.title, item.fill);
  }

  //下载报告
  exportclick() {
    this.downloadLoading = true;
    let docxsrc = "data.docx"; //模板文件的位置
    console.log("topicData", this.topicData);
    let queryStepListData = this.topicData.map(item => {
      let topicShow = true;
      let typeShow = true;
      if (item.type === typeEnum.PARAGRAPH) {
        topicShow = false;
        item.title = item.title.replace(/<[^>]+>/g, "");
      } else if (item.type === typeEnum.FILL) {
        typeShow = false;
      }
      return {
        topicShow,
        typeShow,
        title: item.title,
        type: item.type,
        option: item.option,
        assessCount: item.assessCount
      };
    });
    const data = {
      form: {
        title: this.titleText
      },
      list: queryStepListData
    };
    // 读取并获得模板文件的二进制内容
    JSZipUtils.getBinaryContent(docxsrc, (error: any, content: any) => {
      // docxsrc是模板。我们在导出的时候，会根据此模板来导出对应的数据
      // 抛出异常
      if (error) {
        throw error;
      }
      // 创建一个PizZip实例，内容为模板的内容
      let zip = new PizZip(content);
      // 创建并加载docx templater实例对象
      let doc = new docxtemplater().loadZip(zip);
      // 设置模板变量的值
      doc.setData({
        ...data.form,
        list: data.list
      });
      try {
        // 用模板变量的值替换所有模板变量
        doc.render();
      } catch (error: any) {
        // 抛出异常
        let e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties
        };
        console.log(
          JSON.stringify({
            error: e
          })
        );
        throw error;
      }
      // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
      let out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // 将目标文件对象保存为目标类型的文件，并命名
      saveAs(out, this.titleText);
      this.downloadLoading = false;
    });
  }
}
