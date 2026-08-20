import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { By } from '@angular/platform-browser';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create navigation component', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct navigation items', () => {
    expect(component.navItems.length).toBe(3);
    expect(component.navItems.map(i => i.route)).toEqual(['/dashboard', '/accounts', '/transactions']);

    const navLinks = fixture.debugElement.queryAll(By.css('a.nav-link'));
    expect(navLinks.length).toBe(3);
  });

  it('should render correct icon classes and routerLink attributes', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('a.nav-link'));

    const dashboardLink = navLinks[0].nativeElement as HTMLAnchorElement;
    expect(dashboardLink.getAttribute('href')).toBe('/dashboard');
    expect(dashboardLink.querySelector('.nav-icon')?.className).toContain('pi-chart-bar');

    const accountsLink = navLinks[1].nativeElement as HTMLAnchorElement;
    expect(accountsLink.getAttribute('href')).toBe('/accounts');
    expect(accountsLink.querySelector('.nav-icon')?.className).toContain('pi-wallet');

    const transactionsLink = navLinks[2].nativeElement as HTMLAnchorElement;
    expect(transactionsLink.getAttribute('href')).toBe('/transactions');
    expect(transactionsLink.querySelector('.nav-icon')?.className).toContain('pi-list');
  });
});
