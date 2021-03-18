import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReviewComponent } from './review/review.component';
import {ChartsModule} from 'ng2-charts';

// TODO: Get mid from movies.service.ts
const routes: Routes = [
  {path: 'tabs/tab2/299536', component: ReviewComponent}
]

@NgModule({
  declarations: [AppComponent, ReviewComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), 
            AppRoutingModule, HttpClientModule, ChartsModule,
            RouterModule.forRoot(routes)
            ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
