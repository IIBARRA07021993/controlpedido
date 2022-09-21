import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoPalPageRoutingModule } from './pedido-pal-routing.module';

import { PedidoPalPage } from './pedido-pal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoPalPageRoutingModule
  ],
  declarations: [PedidoPalPage]
})
export class PedidoPalPageModule {}
