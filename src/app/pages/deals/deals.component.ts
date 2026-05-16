import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectDeals,
  selectIsLoadingDeals,
  selectPaginationData,
  selectTotal,
} from '../../store/deals/selector';
import { filterDeals, loadDeals } from '../../store/deals/actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateDealDialogComponent } from './create-deal-dialog/create-deal-dialog.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PurchasePriceComparison } from '../../models/deal.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    DecimalPipe,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsComponent {
  protected readonly filterForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    purchasePrice: new FormControl<number | null>(null),
    operator: new FormControl<PurchasePriceComparison>('gt', {
      nonNullable: true,
    }),
  });

  protected readonly displayedColumns = [
    'name',
    'address',
    'purchasePrice',
    'noi',
    'capRate',
  ];
  protected readonly deals = this.store.selectSignal(selectDeals);
  protected readonly total = this.store.selectSignal(selectTotal);
  protected readonly loading = this.store.selectSignal(selectIsLoadingDeals);
  protected readonly paginationData =
    this.store.selectSignal(selectPaginationData);

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    this.store.dispatch(loadDeals({}));

    const formValueChange = toSignal(
      this.filterForm.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(
          (a, b) =>
            a.name === b.name &&
            a.purchasePrice === b.purchasePrice &&
            a.operator === b.operator,
        ),
      ),
    );
    effect(
      () => {
        const filter = formValueChange();
        this.store.dispatch(filterDeals({ filter }));
      },
      { allowSignalWrites: true },
    );
  }

  protected addDeal() {
    this.dialog.open(CreateDealDialogComponent);
  }

  protected onPageChange(event: PageEvent): void {
    this.store.dispatch(
      loadDeals({
        pagination: {
          pageIndex: event.pageIndex,
          pageSize: event.pageSize,
        },
      }),
    );
  }

  protected clear() {
    this.filterForm.reset();
  }
}
