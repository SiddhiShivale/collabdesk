import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AuthModule } from './modules/auth/auth-module';
import { DashboardModule } from './modules/dashboard/dashboard-module';
import { AdminModule } from './modules/admin/admin-module';
import { TeamLeadModule } from './modules/team-lead/team-lead-module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt-interceptor';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,

    AuthModule,
    DashboardModule,
    AdminModule,
    TeamLeadModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}
