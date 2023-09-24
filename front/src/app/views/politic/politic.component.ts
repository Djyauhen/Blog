import {Component, Input, OnInit} from '@angular/core';
import {LoaderService} from "../../shared/services/loader.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-politic',
  templateUrl: './politic.component.html',
  styleUrls: ['./politic.component.scss']
})
export class PoliticComponent {

  constructor(private loaderService: LoaderService) {
    this.loaderService.hide();
  }

}
