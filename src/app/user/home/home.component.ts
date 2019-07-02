import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userHomeForm: FormGroup;
  userType = 'basic';

  constructor(public fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.userHomeForm = this.fb.group({
      userType: [this.userType]
    });
  }

  selectUserType() {
    this.userType = this.userHomeForm.getRawValue().userType;
  }

  submit() {
    this.router.navigate(['user', 'domain-whitelist'], {queryParams: {uType: this.userType}});
  }

}
