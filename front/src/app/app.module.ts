import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from "./shared/shared.module";
import {LayoutComponent} from "./shared/layout/layout.component";
import {HeaderComponent} from "./shared/layout/header/header.component";
import {FooterComponent} from "./shared/layout/footer/footer.component";
import {MainComponent} from './views/main/main.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import { PoliticComponent } from './views/politic/politic.component';
import {AuthInterceptor} from "./core/auth/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    PoliticComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MatSnackBarModule,
    HttpClientModule,
    RouterModule,
    CarouselModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
