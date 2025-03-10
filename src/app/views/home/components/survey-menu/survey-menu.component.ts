import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  selector: "survey-menu",
  imports: [RouterLink, NzMenuModule, NzIconModule],
  templateUrl: "./survey-menu.component.html"
})
export class SurveyMenuComponent {}
