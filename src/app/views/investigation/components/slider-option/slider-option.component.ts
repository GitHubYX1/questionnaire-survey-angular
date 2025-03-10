import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzMessageService } from "ng-zorro-antd/message";
import { isValidNumber } from "app/utils/isValidType";

@Component({
  selector: "slider-option",
  imports: [FormsModule, NzInputModule],
  templateUrl: "./slider-option.component.html",
  styleUrl: "./slider-option.component.scss"
})
export class SliderOptionComponent {
  @Input() min = {
    content: "",
    id: 0
  };
  @Input() max = {
    content: "",
    id: 0
  };
  @Output() numChange = new EventEmitter<{ num: number; value: number }>(); //数值变化
  minNumber = 0;
  maxNumber = 0;
  constructor(private message: NzMessageService) {}
  ngOnInit() {
    this.maxNumber = this.max.id;
    this.minNumber = this.min.id;
  }

  // 处理输入框失焦事件
  handleInputBlur(num: number, value: number) {
    value = Number(value);
    if (!isValidNumber(value)) {
      const text = num === 0 ? "最小值" : "最大值";
      this.message.error(`${text}输入内容不合法！`);
      this.updateInputValue(num, num === 0 ? this.min.id : this.max.id);
      return;
    }
    if ((num === 0 && value >= this.maxNumber) || (num === 1 && value <= this.minNumber)) {
      this.message.error(`最大值不能小于最小值！`);
      this.updateInputValue(num, num === 0 ? this.min.id : this.max.id);
    } else {
      this.numChange.emit({ num, value });
    }
  }

  //更新输入值
  updateInputValue(num: number, defaultValue: number) {
    if (num === 0) {
      this.minNumber = defaultValue;
    } else {
      this.maxNumber = defaultValue;
    }
  }
}
