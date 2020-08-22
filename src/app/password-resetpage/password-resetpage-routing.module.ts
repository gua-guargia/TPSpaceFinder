import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordResetpagePage } from './password-resetpage.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordResetpagePageRoutingModule {}
