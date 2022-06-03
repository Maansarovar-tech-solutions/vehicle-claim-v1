import { TestBed } from '@angular/core/testing';

import { ExcelSaveService } from './excel-save.service';

describe('ExcelSaveService', () => {
  let service: ExcelSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
