import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {isEmpty} from 'rxjs/operators';

@Component({
  selector: 'app-domain-whitelist',
  templateUrl: './domain-whitelist.component.html',
  styleUrls: ['./domain-whitelist.component.css']
})
export class DomainWhitelistComponent implements OnInit {

  domainWhiteListForm: FormGroup;
  whiteListingLimit: number;
  uniqueIps: Set<string> = new Set();
  savedIps = [];
  isDataModified: boolean;
  validIp = true;


  constructor(public fb: FormBuilder, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const userType = this.activatedRoute.snapshot.queryParams['uType'];
    this.whiteListingLimit = this.getWhitelistLimit(userType);
    this.domainWhiteListForm = this.fb.group({
      ips: this.fb.array([this.fb.group({ip: ['', Validators.pattern(this.regExpForIpAddress())], add: true, remove: false})])
    });
    this.isDataModified = false;
  }

  hasValidIp(): boolean {
    const controls = Array.from(this.ips.controls.values());
    const requiredControls = controls.filter((control) => {
      return control.value.ip !== '' && control.value.ip !== null && control.value.ip !== undefined;
    });
    return requiredControls.length > 0;
  }

  addIp(item, index) {
    const ip = item.value.ip;
    if (ip !== '' && ip !== null && ip !== undefined) {
      this.isDataModified = true;
    }
    this.validIp = this.hasValidIp();
    if (index === 0) {
      this.ips.setControl(0, this.fb.group({
        ip: [this.ips.at(0).value.ip, Validators.pattern(this.regExpForIpAddress())],
        add: false,
        remove: true
      }));
      this.ips.push(this.fb.group({ip: ['', Validators.pattern(this.regExpForIpAddress())], add: true, remove: true}));
    } else {
      this.ips.setControl(index, this.fb.group({
        ip: [this.ips.at(index).value.ip, Validators.pattern(this.regExpForIpAddress())],
        add: false,
        remove: true
      }));

      this.ips.push(this.fb.group({
        ip: ['', Validators.pattern(this.regExpForIpAddress())],
        add: !(this.ips.controls.length + 1 === this.whiteListingLimit),
        remove: true
      }));
    }
  }

  get ips() {
    return this.domainWhiteListForm.get('ips') as FormArray;
  }

  deleteIp(item, index) {
    this.validIp = this.hasValidIp();
    const lastItemIp = this.ips.at(this.ips.controls.length - 1).value.ip;
    const ip = item.value.ip;

    if (this.savedIps.includes(item.value.ip) && (ip !== '' && ip !== null && ip !== undefined)) {
      this.isDataModified = true;
    }
    this.ips.removeAt(index);
    this.ips.setControl(this.ips.controls.length - 1, this.fb.group({
      ip: [lastItemIp, Validators.pattern(this.regExpForIpAddress())],
      add: true,
      remove: this.ips.controls.length >= 2
    }));
  }

  save() {

    const requiredItems = this.domainWhiteListForm.getRawValue()['ips'].filter((item) => {
      return item.ip !== '' && item.ip !== undefined !== item.ip !== null;
    });

    const whiteListedIps = requiredItems.map((item) => {
      return item.ip;
    });
    if (whiteListedIps.length > 0) {
      sessionStorage.setItem('whiteListedIps', JSON.stringify(whiteListedIps));
      const whiteListedIpsSaved = JSON.parse(sessionStorage.getItem('whiteListedIps'));
      this.domainWhiteListForm.reset();
      this.savedIps = whiteListedIpsSaved;
      this.rePopulateAfterSaving(whiteListedIpsSaved);
    }

  }

  rePopulateAfterSaving(whiteListedIps: string[]) {
    this.isDataModified = false;
    const formGroupArray = [];
    for (let i = 0; i < whiteListedIps.length; i++) {
      formGroupArray.push(this.fb.group({
        ip: [whiteListedIps[i],
          Validators.pattern(this.regExpForIpAddress())],
        add: (this.whiteListingLimit - whiteListedIps.length > 0) && (i === whiteListedIps.length - 1)
          && (whiteListedIps.length >= 2) || whiteListedIps.length === 1,
        remove: !(i === 0) || (whiteListedIps.length > 1 && i === 0)
      }));
    }

    this.domainWhiteListForm = this.fb.group({
      ips: this.fb.array(formGroupArray)
    });
  }

  getWhitelistLimit(userType: string) {
    if ('basic' === userType) {
      return 5;
    } else if ('premium' === userType) {
      return 10;
    }
  }

  regExpForIpAddress() {
    return '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
  }

}
