import { Component, Input } from "@angular/core";
import { NgFor } from "@angular/common";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzProgressModule } from "ng-zorro-antd/progress";
import type { analysisType } from "app/types";

@Component({
  selector: "analysis-table",
  imports: [NgFor, NzTableModule, NzProgressModule],
  templateUrl: "./analysis-table.component.html",
  styleUrl: "./analysis-table.component.scss"
})
export class AnalysisTableComponent {
  @Input() tableData: analysisType = {} as analysisType;
}
