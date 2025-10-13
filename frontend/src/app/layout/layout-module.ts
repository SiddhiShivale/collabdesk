import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing-module';
import { MainLayoutComponent } from './main-layout/main-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, RouterModule],
  exports: [MainLayoutComponent],
})
export class LayoutModule {}
