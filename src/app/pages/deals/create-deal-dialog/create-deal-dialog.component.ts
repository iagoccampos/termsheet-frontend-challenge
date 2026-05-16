import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { createDeal, createDealSuccess } from '../../../store/deals/actions';
import {
  selectCreateErrorMsg,
  selectIsCreatingDeal,
} from '../../../store/deals/selector';
import { MatDividerModule } from '@angular/material/divider';
import { map } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { DealService } from '../../../services/deal.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-create-deal-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DecimalPipe,
    CurrencyMaskModule,
  ],
  templateUrl: './create-deal-dialog.component.html',
  styleUrl: './create-deal-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDealDialogComponent {
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<CreateDealDialogComponent>);
  private readonly actions = inject(Actions);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    address: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    purchasePrice: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    noi: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  protected readonly capRate = toSignal(
    this.form.valueChanges.pipe(
      map((value) => {
        if (!value.noi || !value.purchasePrice) {
          return 0;
        }

        return DealService.calculateCapRate(value.noi, value.purchasePrice);
      }),
    ),
    { initialValue: 0 },
  );
  protected readonly loading = this.store.selectSignal(selectIsCreatingDeal);
  protected readonly errMsg = this.store.selectSignal(selectCreateErrorMsg);

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.dialogRef.disableClose = true;
        this.form.disable();
      } else {
        this.dialogRef.disableClose = false;
        this.form.enable();
      }
    });

    this.actions
      .pipe(ofType(createDealSuccess), takeUntilDestroyed())
      .subscribe(() => this.dialogRef.close());
  }

  protected submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.loading()) {
      return;
    }

    const { name, address, purchasePrice, noi } = this.form.getRawValue();

    this.store.dispatch(
      createDeal({
        newDeal: {
          name,
          address,
          purchasePrice: purchasePrice!,
          noi: noi!,
        },
      }),
    );
  }

  protected cancel() {
    this.dialogRef.close();
  }
}
