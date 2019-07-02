import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomainWhitelistComponent} from './domain-whitelist/domain-whitelist.component';
import {HomeComponent} from './home/home.component';
import {RouterModule} from '@angular/router';
import {UserComponent} from './user.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: 'user', component: UserComponent, children: [
        {path: '', component: HomeComponent},
        {path: 'home', component: HomeComponent},
        {path: 'domain-whitelist', component: DomainWhitelistComponent}]
    }])
  ],
  declarations: [DomainWhitelistComponent, HomeComponent, UserComponent]
})
export class UserModule {
}
