import { Component, OnInit } from "@angular/core";

@Component({
  selector: "logout-icon",
  template: `
  <svg class='logout-icon' xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve">
  <g>
    <path xmlns="http://www.w3.org/2000/svg" d="m12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10c1.5527-.00116 3.0842.35978 4.4729 1.05414 1.3888.69437 2.5964 1.70304 3.5271 2.94586h-2.71c-1.1548-1.01824-2.5788-1.68164-4.1013-1.9106-1.5224-.22896-3.0786-.01374-4.48181.61982-1.40318.63355-2.59374 1.65854-3.42882 2.95197s-1.2792 2.80031-1.27907 4.33991.4445 3.0464 1.27979 4.3397c.8353 1.2933 2.02603 2.3181 3.42931 2.9514 1.4033.6333 2.9595.8483 4.4819.6191 1.5225-.2292 2.9464-.8929 4.101-1.9113h2.71c-.9308 1.243-2.1386 2.2517-3.5275 2.9461s-2.9207 1.0552-4.4735 1.0539zm7-6v-3h-8v-2h8v-3l5 4z" fill="#000000" data-original="#000000" class="">
    </path>
    <script></script>
  </g>
</svg>

`,
styleUrls: ['../icons.css']
})
export class LogoutIconComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
