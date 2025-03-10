import { Component, Input } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { SliderItemComponent } from "app/components/slider-item/slider-item.component";
import type { questionType } from "app/types";
import { typeEnum } from "assets/common/enums";

@Component({
  selector: "matrix-item",
  imports: [ReactiveFormsModule, NzFormModule, NzRadioModule, NzCheckboxModule, SliderItemComponent],
  templateUrl: "./matrix-item.component.html",
  styleUrl: "./matrix-item.component.scss"
})
export class MatrixItemComponent {
  @Input() question: questionType | undefined;
  @Input() formGroup!: FormGroup;
  typeEnum = typeEnum;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    if (this.question && this.question.children && !this.formGroup) {
      const json: any = {};
      for (let item of this.question.children) {
        json[item.id] = [""];
      }
      this.formGroup = this.fb.group(json);
    }
  }
}
