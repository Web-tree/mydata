import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(DataService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });

  it('should call backend on save', () => {
    const data = {
      name: 'a name',
      value: 'a value'
    };

    service.save(data).subscribe();

    let request = httpMock.expectOne(environment.backend + '/data/text');
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual(data);
  });
});
