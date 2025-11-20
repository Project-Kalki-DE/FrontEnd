import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DOCUMENT } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockDocument: any;
  let mockElement: HTMLElement;

  const setupTestBed = (pathname: string) => {
    beforeEach(waitForAsync(() => {
      // Create spies and mocks inside beforeEach
      mockElement = document.createElement('div');
      spyOn(mockElement, 'scrollIntoView');

      mockDocument = {
        location: { pathname },
        getElementById: jasmine.createSpy('getElementById').and.callFake((id: string) => {
          return id === 'nonexistent' ? null : mockElement;
        }),
        querySelector: (selector: string) => document.querySelector(selector),
        querySelectorAll: (selector: string) => document.querySelectorAll(selector),
        createElement: (tag: string) => document.createElement(tag),
        createTextNode: (text: string) => document.createTextNode(text),
        createComment: (data: string) => document.createComment(data), // Add this line
        head: document.head,
        body: document.body,
      };

      TestBed.configureTestingModule({
        imports: [HomeComponent, RouterTestingModule],
        providers: [{ provide: DOCUMENT, useValue: mockDocument }],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  };

  describe('with English language path', () => {
    setupTestBed('/en/home');
    it('should set the language to English', () => {
      expect(component.currentLang).toBe('EN');
    });
  });

  describe('with Turkish language path', () => {
    setupTestBed('/tr/home');
    it('should set the language to Turkish', () => {
      expect(component.currentLang).toBe('TR');
    });
  });

  describe('with German language path', () => {
    setupTestBed('/de/home');
    it('should set the language to German', () => {
      expect(component.currentLang).toBe('DE');
    });
  });

  describe('with default language path', () => {
    setupTestBed('/home');
    it('should default the language to German', () => {
      expect(component.currentLang).toBe('DE');
    });
  });

  describe('scrollTo', () => {
    setupTestBed('/en/home');

    it('should call scrollIntoView on the element', () => {
      component.scrollTo('services');
      expect(mockDocument.getElementById).toHaveBeenCalledWith('services');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should not throw if element is not found', () => {
      expect(() => component.scrollTo('nonexistent')).not.toThrow();
      expect(mockDocument.getElementById).toHaveBeenCalledWith('nonexistent');
    });
  });
});
