import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEspecialidadesComponent } from './manage-especialidades.component';

describe('ManageEspecialidadesComponent', () => {
  let component: ManageEspecialidadesComponent;
  let fixture: ComponentFixture<ManageEspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEspecialidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
