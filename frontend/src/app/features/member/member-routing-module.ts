import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTasksComponent } from './components/my-tasks/my-tasks';

const routes: Routes = [
  { path: 'my-tasks', component: MyTasksComponent },
  { path: '', redirectTo: 'my-tasks', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }