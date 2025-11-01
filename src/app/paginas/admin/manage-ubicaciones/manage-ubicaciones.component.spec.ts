import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUbicacionesComponent } from './manage-ubicaciones.component';

describe('ManageUbicacionesComponent', () => {
  let component: ManageUbicacionesComponent;
  let fixture: ComponentFixture<ManageUbicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUbicacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
