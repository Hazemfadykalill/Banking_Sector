import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BankingDataService } from './banking-data.service';

describe('BankingDataService', () => {
  let service: BankingDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankingDataService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BankingDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and cache customers via shareReplay(1)', () => {
    const mockCustomers = [
      { id: 'cust-1', name: 'Test Customer', email: 'test@example.com' }
    ];

    let response1: any;
    let response2: any;

    service.getCustomers().subscribe(res => response1 = res);
    service.getCustomers().subscribe(res => response2 = res);

    const req = httpMock.expectOne('assets/mock/customers.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);

    expect(response1).toEqual(mockCustomers);
    expect(response2).toEqual(mockCustomers);
  });
});
