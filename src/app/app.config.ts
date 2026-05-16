import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './store/auth/reducer';
import { AuthEffect } from './store/auth/effects';
import { dealsReducer } from './store/deals/reducer';
import { DealsEffect } from './store/deals/effects';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from 'ng2-currency-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ auth: authReducer, deals: dealsReducer }),
    provideEffects(AuthEffect, DealsEffect),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'always' },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { maxWidth: 512, autoFocus: 'first-tabbable' },
    },
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: {
        align: 'left',
        allowNegative: false,
        decimal: '.',
        precision: 2,
        prefix: '$ ',
        suffix: '',
        thousands: ',',
      },
    },
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
