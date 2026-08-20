import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { returnUrl: '/accounts' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as invalid', () => {
    expect(component.loginForm.invalid).toBeTrue();
    expect(component.emailControl.value).toBe('');
    expect(component.passwordControl.value).toBe('');
  });

  it('should validate email format and whitespace', () => {
    component.emailControl.setValue('invalid-email');
    expect(component.emailControl.hasError('email')).toBeTrue();

    component.emailControl.setValue('   ');
    expect(component.emailControl.hasError('whitespace')).toBeTrue();

    component.emailControl.setValue('valid@example.com');
    expect(component.emailControl.valid).toBeTrue();
  });

  it('should auto-fill demo credentials using fillDemoUser', () => {
    component.fillDemoUser('sarah.jenkins@example.com');
    expect(component.emailControl.value).toBe('sarah.jenkins@example.com');
    expect(component.passwordControl.value).toBe('Password123!');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should mark controls touched and block submit if form is invalid', () => {
    component.onSubmit();
    expect(component.emailControl.touched).toBeTrue();
    expect(component.passwordControl.touched).toBeTrue();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should authenticate user and navigate to returnUrl on valid submit', fakeAsync(() => {
    authServiceSpy.login.and.returnValue({ success: true });
    component.fillDemoUser('sarah.jenkins@example.com');

    component.onSubmit();
    expect(component.isLoading()).toBeTrue();

    tick(450);

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'sarah.jenkins@example.com',
      password: 'Password123!'
    });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/accounts');
  }));

  it('should display error banner on failed login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue({ success: false, error: 'Invalid email or password.' });
    component.fillDemoUser('unknown@example.com');

    component.onSubmit();
    tick(450);

    expect(component.errorMessage()).toBe('Invalid email or password.');
    expect(component.isLoading()).toBeFalse();
  }));
});
