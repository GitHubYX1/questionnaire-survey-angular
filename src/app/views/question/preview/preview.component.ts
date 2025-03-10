import { Component } from "@angular/core";
import { QuestionComponent } from "../question.component";

@Component({
  selector: "app-preview",
  imports: [QuestionComponent],
  templateUrl: "./preview.component.html"
})
export class PreviewComponent {}
