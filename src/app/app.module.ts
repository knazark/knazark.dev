import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { Routes, RouterModule } from '@angular/router';
import {ToggleService} from './services/toggle.service';

const appRoutes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
  }
]

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    ToggleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
