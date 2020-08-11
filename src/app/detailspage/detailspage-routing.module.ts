import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailspagePage } from './detailspage.page';

const routes: Routes = [
  {
    path: '',
    component: DetailspagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailspagePageRoutingModule {}
