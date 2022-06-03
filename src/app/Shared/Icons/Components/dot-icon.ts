import { Component, OnInit } from "@angular/core";

@Component({
  selector: "dot-icon",
  template: `
  <svg class="dot-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"  x="0" y="0" viewBox="0 0 480 480" style="enable-background:new 0 0 512 512" xml:space="preserve">
  <g>
    <path xmlns="http://www.w3.org/2000/svg" d="m432 240c0 106.039062-85.960938 192-192 192s-192-85.960938-192-192 85.960938-192 192-192 192 85.960938 192 192zm0 0" fill="#cfd2fc" data-original="#cfd2fc" class="">
    </path>
    <path xmlns="http://www.w3.org/2000/svg" d="m240 480c-132.546875 0-240-107.453125-240-240s107.453125-240 240-240 240 107.453125 240 240c-.148438 132.484375-107.515625 239.851562-240 240zm0-464c-123.710938 0-224 100.289062-224 224s100.289062 224 224 224 224-100.289062 224-224c-.140625-123.652344-100.347656-223.859375-224-224zm0 0" fill="#8690fa" data-original="#8690fa" class="">
    </path>
    <path xmlns="http://www.w3.org/2000/svg" d="m352 240c0 61.855469-50.144531 112-112 112s-112-50.144531-112-112 50.144531-112 112-112 112 50.144531 112 112zm0 0" fill="#5153ff" data-original="#5153ff" class="">
    </path>
  </g>
</svg>


`,
styleUrls: ['../icons.css']
})
export class DotIconComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
