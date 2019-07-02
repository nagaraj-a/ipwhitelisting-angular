import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const defaultRoutes: Routes = [
  {path: '', redirectTo: 'user', pathMatch: 'full'},
  {path: '**', redirectTo: 'user', pathMatch: 'full'}];

@NgModule({
  imports: [
    RouterModule.forRoot(defaultRoutes)
  ]
})
export class AppRoutingModule {
}
