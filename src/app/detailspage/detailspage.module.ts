import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailspagePageRoutingModule } from './detailspage-routing.module';

import { DetailspagePage } from './detailspage.page';
import { AgmCoreModule } from '@agm/core';
//AIzaSyA7CuXVShp5DhAd9R6xppUfPijBLF5zmkU

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailspagePageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA7CuXVShp5DhAd9R6xppUfPijBLF5zmkU', 
      libraries: ['places']
    })
  ],
  declarations: [DetailspagePage]
})
export class DetailspagePageModule {}
