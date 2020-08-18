import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA7CuXVShp5DhAd9R6xppUfPijBLF5zmkU', 
      libraries: ['places']
    })
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
