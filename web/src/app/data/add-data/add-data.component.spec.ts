import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDataComponent} from './add-data.component';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {DataService} from '../../_service/data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Observable} from 'rxjs';

describe('AddDataComponent', () => {
  let component: AddDataComponent;
  let fixture: ComponentFixture<AddDataComponent>;
  let dataService: DataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDataComponent],
      providers: [DataService],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AddDataComponent);
    dataService = TestBed.get(DataService);
  }));

  describe('component', () => {
    beforeEach(() => {
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should call service on submit', () => {
      let observable = new Observable();
      spyOn(observable, 'subscribe');
      spyOn(dataService, 'save').and.returnValue(observable);
      component.model = {
        name: 'a name',
        value: 'a value'
      };
      component.onSubmit();

      expect(dataService.save).toHaveBeenCalledWith(component.model);
      expect(observable.subscribe).toHaveBeenCalled();
    });
  });

  describe('elements', () => {
    describe('fields', () => {
      [
        'Name',
        'Value'
      ].forEach(
        (name) => {
          describe(name + ' field', () => {
            const inputId = 'add-data-' + name.toLowerCase() + '-input';
            describe('Field', () => {
              let nameField: DebugElement;
              beforeEach(() => {
                nameField = fixture.debugElement.query(By.css('input[id="' + inputId + '"]'));
              });
              it('should exist', () => {
                expect(nameField).not.toBeNull(nameField);
              });
              it('should be required', () => {
                expect(nameField.nativeElement.hasAttribute('required')).toBeTruthy();
              });
            });
            describe('label', () => {
              let label: DebugElement;
              beforeEach(() => {
                label = fixture.debugElement.query(By.css('label[for=' + inputId + ']'));
              });
              it('should have a label', function () {
                expect(label).not.toBeNull();
                expect(label.nativeElement.textContent.trim()).toContain(name)
              });
            });
          });
        }
      );
    });
    describe('buttons', () => {
      describe('submit', () => {
        let submitButton: DebugElement;
        beforeEach(() => {
          submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
        });
        it('should exist', () => {
          expect(submitButton).not.toBeNull();
        });
        it('should has text inside', () => {
          expect(submitButton.nativeElement.textContent).toContain('Add new data');
        });
        it('should be bound to submit method', () => {
          component = fixture.componentInstance;
          fixture.detectChanges();
          spyOn(component, 'onSubmit');
          submitButton.nativeElement.click();
          expect(component.onSubmit).toHaveBeenCalled();
        });
      })
    });
  });


});
