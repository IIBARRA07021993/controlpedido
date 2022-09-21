import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManVirtualPageRoutingModule } from './man-virtual-routing.module';

import { ManVirtualPage } from './man-virtual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManVirtualPageRoutingModule
  ],
  declarations: [ManVirtualPage]
})
export class ManVirtualPageModule {}
