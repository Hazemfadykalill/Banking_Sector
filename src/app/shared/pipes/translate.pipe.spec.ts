import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { LanguageService } from '../../core/services/language.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let langService: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageService, TranslatePipe]
    });
    langService = TestBed.inject(LanguageService);
    pipe = TestBed.inject(TranslatePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform key to English translation by default', () => {
    expect(pipe.transform('app.title')).toBe('APEX');
  });

  it('should transform key to Arabic when language changes', () => {
    langService.setLanguage('ar');
    expect(pipe.transform('app.title')).toBe('أبيكس');
  });

  it('should return empty string if key is empty', () => {
    expect(pipe.transform('')).toBe('');
  });
});
