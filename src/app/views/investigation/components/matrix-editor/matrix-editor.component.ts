import { Component, Input, Output, EventEmitter } from "@angular/core";
import { NgIf, NgFor } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { questionType } from "app/types/index";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzButtonModule } from "ng-zorro-antd/button";
import { SliderItemComponent } from "app/components/slider-item/slider-item.component";
import { typeEnum } from "assets/common/enums";

@Component({
  selector: "matrix-editor",
  imports: [NgIf, NgFor, FormsModule, NzInputModule, NzDropDownModule, NzIconModule, NzRadioModule, NzCheckboxModule, NzButtonModule, SliderItemComponent],
  templateUrl: "./matrix-editor.component.html",
  styleUrl: "./matrix-editor.component.scss"
})
export class MatrixEditorComponent {
  @Input() question: questionType = {} as questionType;
  @Output() addRows = new EventEmitter<number>(); //添加行
  @Output() removeRows = new EventEmitter<number>(); //删除行
  @Output() moveRows = new EventEmitter<{ rows: number; action: string }>(); //移动行
  @Output() addColumn = new EventEmitter<number>(); //添加列
  @Output() removeColumn = new EventEmitter<{ column: number; id: number }>(); //删除列
  @Output() moveColumn = new EventEmitter<{ column: number; action: string }>(); //移动列
  typeEnum = typeEnum;
}
