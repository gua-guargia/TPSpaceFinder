import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordResetpagePageRoutingModule } from './password-resetpage-routing.module';

import { PasswordResetpagePage } from './password-resetpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PasswordResetpagePageRoutingModule
  ],
  declarations: [PasswordResetpagePage]
})
export class PasswordResetpagePageModule {}
