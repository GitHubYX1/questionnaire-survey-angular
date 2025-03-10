import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { DataHeaderComponent } from "./components/data-header/data-header.component";

@Component({
  selector: "app-data",
  imports: [RouterOutlet, NzLayoutModule, DataHeaderComponent],
  templateUrl: "./data.component.html",
  styleUrl: "./data.component.scss"
})
export class DataComponent {}
