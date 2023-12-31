import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {PoliticComponent} from "./views/politic/politic.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: 'politic', component: PoliticComponent},
      {path: '', loadChildren: () => import('./views/blog/blog.module').then(m => m.BlogModule)},
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)}
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
