import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { NgIf } from "@angular/common";
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NzSliderModule } from "ng-zorro-antd/slider";

@Component({
  selector: "slider-item",
  imports: [NgIf, FormsModule, NzSliderModule],
  templateUrl: "./slider-item.component.html",
  styleUrl: "./slider-item.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderItemComponent),
      multi: true
    }
  ]
})
export class SliderItemComponent implements ControlValueAccessor {
  @Input() textShow = true;
  @Input() min = {
    content: "",
    id: 0
  };
  @Input() max = {
    content: "",
    id: 0
  };
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();
  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }
  ngModelChange(event: number) {
    this.value = event;
    this.onChange(event);
    this.valueChange.emit(event);
  }
}
