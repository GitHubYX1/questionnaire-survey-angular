import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzMessageService } from "ng-zorro-antd/message";
import Excel from "exceljs";
import type { questionType } from "app/types";
import { scoreOptionInit } from "app/utils";
import { isValidNumber } from "app/utils/isValidType";
import { typeEnum, validateEnum } from "assets/common/enums";

interface xlsxObjType {
  [prop: string]: any;
}

const { RADIO, CHECKBOX, DROP, SCORE, FILL, PAGING, PARAGRAPH, SLIDER, MATRIX_RADIO, MATRIX_CHECKBOX, MATRIX_SLIDER } = typeEnum;
const typeList = [RADIO, CHECKBOX, DROP, SCORE, FILL, PAGING, PARAGRAPH, SLIDER, MATRIX_RADIO, MATRIX_CHECKBOX, MATRIX_SLIDER];
const oNOption = [FILL, PAGING, PARAGRAPH];
const MATRIX_TOPIC = [MATRIX_RADIO, MATRIX_CHECKBOX, MATRIX_SLIDER];

@Component({
  selector: "survey-upload",
  imports: [FormsModule, NzModalModule, NzButtonModule, NzIconModule, NzRadioModule],
  templateUrl: "./survey-upload.component.html",
  styleUrl: "./survey-upload.component.scss"
})
export class SurveyUploadComponent {
  @Input() questionMaxId = 1000;
  fileVisible = false;
  loading = false;
  uploadText = "";
  uploadRadio = "create";
  errorText = "";
  questionData: questionType[] = [];
  @Output() upload = new EventEmitter<{ question: questionType[]; radio: string }>();

  constructor(private message: NzMessageService) {}

  static uploadOpen() {
    throw new Error("方法未实现。");
  }

  // 打开
  uploadOpen() {
    this.fileVisible = true;
    this.uploadText = "";
    this.errorText = "";
    this.questionData = [];
  }
  //取消
  onCancel() {
    this.fileVisible = false;
  }
  //问卷导入
  importFile(event: any) {
    this.loading = true;
    const file = event.target.files[0];
    //创建workbook
    const workbook = new Excel.Workbook();
    //异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      //解析文件流
      workbook.xlsx
        .load(data)
        .then(async () => {
          const worksheet = workbook.getWorksheet(1);
          const jsonData: xlsxObjType[] = [];
          worksheet?.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
              // 忽略标题行
              const rowData: xlsxObjType = {};
              row.eachCell((cell, colNumber) => {
                rowData[String(worksheet.getCell(1, colNumber).value)] = cell.value;
              });
              jsonData.push(rowData);
            }
          });
          try {
            // 获取题目列表
            const questionList = await this.processQuestionData(jsonData);
            this.errorText = "";
            this.uploadText = file.name;
            this.questionData = questionList;
            this.loading = false;
          } catch (error: any) {
            this.errorTextInit(error);
          }
        })
        .catch(res => {
          this.errorTextInit("上传文件有问题！");
          console.error(res);
        });
    };
    reader.readAsArrayBuffer(file);
  }
  // 错误文本初始化
  errorTextInit(text: string) {
    this.errorText = text;
    this.loading = false;
  }
  // 新增的函数，处理数据并验证
  async processQuestionData(data: xlsxObjType[]) {
    const questions: questionType[] = [];
    let id = Number(this.questionMaxId);
    for (let i = 0; i < data.length; i++) {
      const index = i + 1;
      const rowData = data[i];
      if (rowData["类型"] == PAGING) rowData["标题"] = PAGING;
      else if (!rowData["标题"]) throw `第${index}题目标题未填写！`;
      if (!rowData["类型"]) throw `第${index}题目类型未填写！`;
      if (!typeList.includes(rowData["类型"])) throw `第${index}题目类型错误！`;
      let option = rowData["选项"]
        ? rowData["选项"].split("|").map((item: string) => {
            let data = item.split("~");
            return {
              id: Number(data[0]),
              content: data[1]
            };
          })
        : [];
      if (!oNOption.includes(rowData["类型"]) && option.length === 0) throw `第${index}题目选项未填写！`;
      // 检查选项序号重复
      const idSet = new Set(option.map(({ id }: { id: number }) => id));
      if (option.length !== idSet.size) throw `第${index}题目选项序号有重复！`;
      if (rowData["类型"] === SCORE) {
        if (option.length > 10) throw `第${index}题目评分选项不能超过10个！`;
        option = scoreOptionInit(option.length);
      } else if (rowData["类型"] === SLIDER || rowData["类型"] === MATRIX_SLIDER) {
        if (option.length !== 2) throw `第${index}题目滑动条选必须是2个！`;
        if (option[0].id > option[1].id) throw `第${index}题目滑动条最小值不能大于最大值！`;
        if (!isValidNumber(option[0].id) || !isValidNumber(option[1].id)) throw `第${index}题目滑动条序号范围应当是0~100！`;
      }
      const json: questionType = {
        id,
        title: rowData["标题"],
        type: rowData["类型"],
        option,
        must: rowData["必答题"] === "是" ? 1 : 0,
        column: 1,
        chooseMin: 0,
        chooseMax: 0,
        validateType: validateEnum.DEFAULT,
        children: [],
        isHide: 0
      };
      if (MATRIX_TOPIC.includes(rowData["类型"])) {
        if (!rowData["子问题"]) throw `第${index}矩阵题子问题未填写！`;
        if (json.option.length > 5) throw `第${index}矩阵题选项不能超过5个！`;
        json.children = rowData["子问题"].split("|").map((item: string) => {
          id++;
          return {
            ...json,
            id,
            title: item,
            children: []
          };
        });
      }
      questions.push(json);
      id++;
    }
    return questions;
  }
  //上传questionData数据
  handleOk() {
    if (this.questionData.length === 0) {
      this.message.info("请选择要上传的文件！");
      return;
    }
    this.fileVisible = false;
    this.upload.emit({ question: this.questionData, radio: this.uploadRadio });
  }
}
