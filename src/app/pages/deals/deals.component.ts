import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { loadDeals } from '../../store/deals/actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateDealDialogComponent } from './create-deal-dialog/create-deal-dialog.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
  ],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsComponent {
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
}
