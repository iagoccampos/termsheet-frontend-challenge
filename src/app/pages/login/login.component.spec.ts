import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { login } from '../../store/auth/actions';
import { initialState } from '../../store/auth/reducer';
import { RequestStatus } from '../../data/common';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [provideMockStore({ initialState: { auth: initialState } })],
    });

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login should not dispatch when form is invalid', () => {
    const dispatch = jest.spyOn(store, 'dispatch');

    component['login']();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('login should dispatch login action with credentials when form is valid', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    component['loginForm'].setValue({
      username: 'john',
      password: 'secret',
    });

    component['login']();

    expect(dispatch).toHaveBeenCalledWith(
      login({ username: 'john', password: 'secret' }),
    );
  });

  it('should disable the form while loading and enable it when idle', () => {
    const form = component['loginForm'];

    store.setState({
      auth: { ...initialState, requestStatus: RequestStatus.Loading },
    });
    fixture.detectChanges();
    expect(form.disabled).toBe(true);

    store.setState({ auth: initialState });
    fixture.detectChanges();
    expect(form.enabled).toBe(true);
  });

  it('should disable the submit button while loading', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(false);

    store.setState({
      auth: { ...initialState, requestStatus: RequestStatus.Loading },
    });
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
  });

  it('should show the error message on login failed', () => {
    const p: HTMLParagraphElement =
      fixture.nativeElement.querySelector('#errMsg');

    expect(p.innerHTML).toBe('');

    store.setState({ auth: { ...initialState, errorMsg: 'error' } });
    fixture.detectChanges();

    expect(p.innerHTML).toBe('error');
  });
});
