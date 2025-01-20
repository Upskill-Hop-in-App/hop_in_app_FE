import { TestBed } from '@angular/core/testing';
import { GeoApiService } from './geoapi.service';

describe('GeoApiService', () => {
  let service: GeoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});