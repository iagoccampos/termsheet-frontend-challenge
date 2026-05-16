import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsComponent {}
