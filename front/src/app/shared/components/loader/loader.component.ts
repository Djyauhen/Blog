import {Component, OnInit} from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit{

  isShowed: boolean = true;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.isShowed$.subscribe(isShowed => {
      this.isShowed = isShowed;
    })
  }
}
