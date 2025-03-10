import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from "@angular/core";
import { NgIf } from "@angular/common";
import { provideRouter, withHashLocation } from "@angular/router";
import { zh_CN, provideNzI18n } from "ng-zorro-antd/i18n";
import { registerLocaleData } from "@angular/common";
import zh from "@angular/common/locales/zh";
import { FormsModule } from "@angular/forms";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from "@angular/common/http";
import { routes } from "./app.routes";

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule, NgIf),
    provideAnimationsAsync(),
    provideHttpClient()
  ]
};
