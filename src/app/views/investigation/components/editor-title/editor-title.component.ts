import { Component, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzInputModule } from "ng-zorro-antd/input";
import { RichTinymceComponent } from "app/components/rich-tinymce/rich-tinymce.component";

@Component({
  selector: "editor-title",
  imports: [FormsModule, NzModalModule, NzButtonModule, NzIconModule, NzRadioModule, NzInputModule, RichTinymceComponent],
  templateUrl: "./editor-title.component.html",
  styleUrl: "./editor-title.component.scss"
})
export class EditorUploadComponent {
  visible = false;
  titleValue = "";
  contentValue = "";
  @Output() titleModify = new EventEmitter<{ title: string; content: string }>();

  static open(_: string, __: string) {
    throw new Error("方法未实现。");
  }
  open(title: string, content: string) {
    this.visible = true;
    this.titleValue = title;
    this.contentValue = content;
  }
  inputValueChange(value: string) {
    this.contentValue = value;
  }
  handleOk() {
    if (this.contentValue.replace(/<[^>]+>/g, "") == "") {
      this.contentValue = "";
    }
    document.getElementById("focal")?.focus();
    this.titleModify.emit({ title: this.titleValue, content: this.contentValue });
    this.visible = false;
  }
}
