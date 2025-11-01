import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing-module';
import { MemberLayoutComponent } from './components/member-layout/member-layout';


@NgModule({
  declarations: [
    MemberLayoutComponent
  ],
  imports: [
    CommonModule,
    MemberRoutingModule
  ]
})
export class MemberModule { }
