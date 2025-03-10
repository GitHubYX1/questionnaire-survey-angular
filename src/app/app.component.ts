import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NzIconService } from "ng-zorro-antd/icon";

const radioCircular = `
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" p-id="11977">
    <path
      d="M512 960c249.6 0 448-198.4 448-448s-198.4-448-448-448-448 198.4-448 448 198.4 448 448 448z m0 64c-281.6 0-512-230.4-512-512s230.4-512 512-512 512 230.4 512 512-230.4 512-512 512z"
      p-id="11359"></path>
    <path d="M512 512m-210 0a210 210 0 1 0 420 0 210 210 0 1 0-420 0Z" p-id="13118"></path>
  </svg>
`;
const sliderStrip = `
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" p-id="3622">
    <path
      d="M512 230.4c138.0352 0 252.8768 99.328 276.9664 230.4H985.6a12.8 12.8 0 0 1 12.8 12.8v76.8a12.8 12.8 0 0 1-12.8 12.8h-196.6336c-24.0896 131.072-138.9312 230.4-276.9664 230.4-138.0352 0-252.8768-99.328-276.9664-230.4H38.4a12.8 12.8 0 0 1-12.8-12.8v-76.8a12.8 12.8 0 0 1 12.8-12.8h196.6336c24.064-131.072 138.9312-230.4 276.9664-230.4z m0 102.4a179.2 179.2 0 1 0 0 358.4 179.2 179.2 0 0 0 0-358.4z"
      p-id="3623"></path>
  </svg>
`;
const matrixRadio = `
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" p-id="16898">
    <path
      d="M641.7 252.2C603.7 117.2 480.2 21 337.8 21 163.1 21 21 163.2 21 337.8c0 142.3 96.2 265.9 231.2 303.8 8.4 199 172.5 358.5 373.6 358.5 206.4 0 374.4-168 374.4-374.4 0-201-159.5-365.1-358.5-373.5zM78.6 337.8c0-142.9 116.3-259.2 259.2-259.2 111.7 0 209.4 72.3 244.6 175.5-171.8 20-308.3 156.5-328.3 328.3C150.9 547.2 78.6 449.6 78.6 337.8z m547.2 604.8C451.1 942.6 309 800.4 309 625.8S451.1 309 625.8 309s316.8 142.1 316.8 316.8-142.1 316.8-316.8 316.8z"
      p-id="16899"></path>
    <path d="M625.8 625.8m-129.6 0a129.6 129.6 0 1 0 259.2 0 129.6 129.6 0 1 0-259.2 0Z" p-id="16900"></path>
  </svg>
`;
const matrixCheckbox = `
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" p-id="43088">
    <path
      d="M654.6 251.4V21H21v633.6h230.4v345.6h748.8V251.4H654.6zM78.6 597V78.6H597v172.8H251.4V597H78.6z m864 345.6H309V309h633.6v633.6z"
      p-id="43089"></path>
    <path d="M836.2 508.1L795 467.9 568.4 699.7 456.8 583.1l-41.6 39.8 152.7 159.6z" p-id="43090"></path>
  </svg>
`;
const matrixSlider = `
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024" p-id="22317">
    <path
      d="M672 128c74.24 0 136.64 50.56 154.752 119.04l2.048 8.96H960v64h-131.2l-2.048 8.96a160.064 160.064 0 0 1-309.504 0L515.2 320H64V256h451.2l2.048-8.96A160.064 160.064 0 0 1 672 128z m0 64a96 96 0 1 0 0 192 96 96 0 0 0 0-192zM352 576c74.24 0 136.64 50.56 154.752 119.04l2.048 8.96H960v64H508.8l-2.048 8.96a160.064 160.064 0 0 1-309.504 0L195.2 768H64v-64h131.2l2.048-8.96A160.064 160.064 0 0 1 352 576z m0 64a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"
      p-id="22318"></path>
  </svg>
`;

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent {
  constructor(private iconService: NzIconService) {
    this.iconService.addIconLiteral("radio-circular:antd", radioCircular);
    this.iconService.addIconLiteral("slider-strip:antd", sliderStrip);
    this.iconService.addIconLiteral("matrix-radio:antd", matrixRadio);
    this.iconService.addIconLiteral("matrix-checkbox:antd", matrixCheckbox);
    this.iconService.addIconLiteral("matrix-slider:antd", matrixSlider);
  }
}
