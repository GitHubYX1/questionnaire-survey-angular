import { Routes } from "@angular/router";
import { HomeComponent } from "./views/home/home.component";
import { HomeDataComponent } from "./views/home/pages/home-data/home-data.component";
import { ProjectComponent } from "./views/home/pages/project/project.component";
import { InvestigationComponent } from "./views/investigation/investigation.component";
import { QuestionComponent } from "./views/question/question.component";
import { PreviewComponent } from "./views/question/preview/preview.component";
import { SuccessComponent } from "./views/question/success/success.component";
import { DataComponent } from "./views/data/data.component";
import { AnalysisComponent } from "./views/data/pages/analysis/analysis.component";
import { AnswerComponent } from "./views/data/pages/answer/answer.component";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/home" },
  {
    path: "",
    component: HomeComponent,
    children: [
      { path: "home", component: HomeDataComponent },
      { path: "project", component: ProjectComponent }
    ]
  },
  { path: "investigation", component: InvestigationComponent },
  { path: "question", component: QuestionComponent },
  { path: "preview", component: PreviewComponent },
  { path: "question/success", component: SuccessComponent },

  {
    path: "data",
    component: DataComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "analysis" },
      { path: "analysis", component: AnalysisComponent },
      { path: "answer", component: AnswerComponent }
    ]
  }
];
