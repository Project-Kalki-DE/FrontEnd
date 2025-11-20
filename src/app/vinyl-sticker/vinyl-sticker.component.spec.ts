import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinylStickerComponent } from './vinyl-sticker.component';

describe('VinylStickerComponent', () => {
  let component: VinylStickerComponent;
  let fixture: ComponentFixture<VinylStickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinylStickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VinylStickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
