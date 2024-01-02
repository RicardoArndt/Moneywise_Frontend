import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from './models/table';

@Component({
  selector: 'moneywise-app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table--responsive">
      <table class="table" cellPadding="0" cellSpacing="0">
        <thead class="table__head">
          @for (h of table.getHead(); track h.id) {
            <tr class="table__line">
              @for (c of h.columns; track c.id) {
                <th class="table__column">{{ c.value }}</th>
              }
            </tr>
          }
        </thead>

        <tbody class="table__body">
          @for (r of table.getRows(); track r.id) {
            <tr class="table__line">
              @for (c of r.columns; track c.id) {
                @if (!c.component) {
                  <td class="table__column">{{ c.value }}</td>
                } @else {
                  <td class="table__column">
                    <ng-container *ngComponentOutlet="
                      c.component;
                      inputs: c.inputs;
                    " />
                  </td>
                }
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class TableComponent {
  @Input()
  public table = new Table();
}
