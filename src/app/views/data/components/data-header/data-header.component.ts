import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { SurveyService } from "app/stores/survey.service";

interface optionType {
  value: string;
  label: string;
}

@Component({
  selector: "data-header",
  imports: [FormsModule, RouterLink, NzSelectModule, NzIconModule, NzMenuModule, NzToolTipModule],
  templateUrl: "./data-header.component.html",
  styleUrl: "./data-header.component.scss"
})
export class DataHeaderComponent {
  surveyIdData = "";
  storeOptions: optionType[] = [];

  constructor(
    public surveyStore: SurveyService,
    private router: Router
  ) {}
  ngOnInit() {
    this.storeOptions = this.surveyStore.surveyData.map(item => ({ value: item.id, label: item.title }));
    this.surveyIdData = this.surveyStore.surveyId;
  }
  ngModelChange(value: string) {
    this.surveyStore.modifySurveyId(value);
  }
  quit() {
    this.router.navigate(["/project"]);
  }
}
