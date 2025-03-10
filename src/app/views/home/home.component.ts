import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { SurveyMenuComponent } from "./components/survey-menu/survey-menu.component";

@Component({
  selector: "app-home",
  imports: [RouterOutlet, NzLayoutModule, SurveyMenuComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss"
})
export class HomeComponent {}
