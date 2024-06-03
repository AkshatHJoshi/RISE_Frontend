import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincreditComponent } from './admincredit.component';

describe('AdmincreditComponent', () => {
  let component: AdmincreditComponent;
  let fixture: ComponentFixture<AdmincreditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmincreditComponent]
    });
    fixture = TestBed.createComponent(AdmincreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
