import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilVetComponent } from './perfil-vet.component';

describe('PerfilVetComponent', () => {
  let component: PerfilVetComponent;
  let fixture: ComponentFixture<PerfilVetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilVetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
