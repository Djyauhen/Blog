import {Component, Input} from '@angular/core';
import {ArticleCardType} from "../../../../types/article-card.type";
import {environment} from "../../../../environments/environment.development";

@Component({
  selector: 'blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent {

  @Input() article!: ArticleCardType
  serverStaticPath: string = environment.serverStaticPath;
  constructor() {
  }



}
