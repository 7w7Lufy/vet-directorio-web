import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetDetailModalComponent } from '../vet-detail-modal/vet-detail-modal.component';

describe('VetDetailModalComponent', () => {
  let component: VetDetailModalComponent;
  let fixture: ComponentFixture<VetDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
