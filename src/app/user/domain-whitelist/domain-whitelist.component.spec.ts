import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DomainWhitelistComponent} from './domain-whitelist.component';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';

describe('DomainWhitelistComponent', () => {
  let component: DomainWhitelistComponent;
  let fixture: ComponentFixture<DomainWhitelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [DomainWhitelistComponent],
      providers: [{
        provide: ActivatedRoute, useValue: {
          snapshot: {queryParams: {uType: 'basic'}}
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainWhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should check initialization', () => {
    expect(component.whiteListingLimit).toEqual(5);
    expect(component.isDataModified).toBeFalsy();
  });

  it('should check addIp method for first ip', () => {
    const fb = new FormBuilder();
    const item = fb.group({ip: '11.22.33.44', add: true, remove: false});
    component.addIp(item, 0);
    expect(component.ips.length).toEqual(2);
    const rawValuesOfControls = Array.from(component.ips.getRawValue().values());
    expect(rawValuesOfControls[0]).toEqual({ip: '11.22.33.44', add: false, remove: true});
    expect(rawValuesOfControls[1]).toEqual({ip: '', add: true, remove: true});
  });

  it('should check addIp method for subsequent ip', () => {
    const fb = new FormBuilder();
    const item1 = fb.group({ip: '11.22.33.441', add: true, remove: false});
    const item2 = fb.group({ip: '11.22.33.442', add: true, remove: false});
    component.addIp(item1, 0);
    component.addIp(item2, 1);
    expect(component.ips.length).toEqual(3);
    const rawValuesOfControls = Array.from(component.ips.getRawValue().values());
    expect(rawValuesOfControls[0]).toEqual({ip: '11.22.33.441', add: false, remove: true});
    expect(rawValuesOfControls[1]).toEqual({ip: '11.22.33.442', add: false, remove: true});
    expect(rawValuesOfControls[2]).toEqual({ip: '', add: true, remove: true});
  });

  it('should check addIp method for max limit', () => {
    const fb = new FormBuilder();
    for (let i = 0; i < component.whiteListingLimit; i++) {
      component.addIp(fb.group({ip: `11.22.33.44${i + 1}`, add: true, remove: false}), i);
    }
    expect(component.ips.length).toEqual(5);
    const rawValuesOfControls = Array.from(component.ips.getRawValue().values());
    expect(rawValuesOfControls[rawValuesOfControls.length - 1]).toEqual({ip: '11.22.33.445', add: false, remove: true});
  });

  it('should check deleteIp method with one Ip', () => {
    const fb = new FormBuilder();
    const item = fb.group({ip: '11.22.33.44', add: true, remove: false});
    component.deleteIp(item, 0);
    expect(component.ips.length).toEqual(1);
    const rawValuesOfControls = Array.from(component.ips.getRawValue().values());
    expect(rawValuesOfControls[0]).toEqual({ip: '', add: true, remove: false});
  });

  it('should check deleteIp method with more than one Ip', () => {
    const fb = new FormBuilder();
    const item1 = fb.group({ip: '11.22.33.441', add: true, remove: false});
    const item2 = fb.group({ip: '11.22.33.442', add: true, remove: false});
    component.addIp(item1, 0);
    component.addIp(item2, 1);
    component.deleteIp(item1, 0);
    expect(component.ips.length).toEqual(2);
    const rawValuesOfControls = Array.from(component.ips.getRawValue().values());
    expect(rawValuesOfControls[0]).toEqual({ip: '11.22.33.442', add: false, remove: true});
    expect(rawValuesOfControls[1]).toEqual({ip: '', add: true, remove: true});
  });
  afterEach(() => {
    fixture.destroy();
  });
});
