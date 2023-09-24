import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogCardComponent} from './components/blog-card/blog-card.component';
import {RouterModule} from "@angular/router";
import {LoaderComponent} from './components/loader/loader.component';


@NgModule({
  declarations: [
    BlogCardComponent,
    LoaderComponent
  ],
  exports: [
    BlogCardComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule {
}
