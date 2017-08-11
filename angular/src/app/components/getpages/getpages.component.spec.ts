import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetpagesComponent } from './getpages.component';

describe('GetpagesComponent', () => {
  let component: GetpagesComponent;
  let fixture: ComponentFixture<GetpagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetpagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
