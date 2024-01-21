import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merge, tap } from 'rxjs';
import { TableComponent } from '../../commons/table/table.component';
import { Table } from '../../commons/table/models/table';
import { ButtonComponent } from '../../commons/button/button.component';
import { ModalService } from '../../commons/modal/services/modal.service';
import { SaleCreationModalComponent } from './components/sale-creation-modal.component'
import { Button } from '../../commons/button/models/button';
import { SalesService } from './services/sales.service';
import { PhonePipe } from '../../commons/pipes/phone.pipe';
import { SaleEditService } from './services/sale-edit.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    TableComponent
  ],
  providers: [
    PhonePipe
  ],
  styles: ``,
  template: `
    <moneywise-app-button right [button]="saleButton" />

    <moneywise-app-table [table]="table" />
  `,
})
export class SalesComponent {
  public table: Table = new Table();

  public readonly saleButton: Button = new Button(this.openModalSaleCreation.bind(this), 'Vender');

  public constructor(
    private readonly modalService: ModalService,
    private readonly salesService: SalesService,
    private readonly saleEditService: SaleEditService
  ) { }

  ngOnInit() {
    merge(
      this.salesService.readAll().pipe(tap(table => this.table = table)), 
    ).subscribe();
  }

  public openModalSaleCreation() {
    this.saleEditService.edit(0);
    this.modalService.open(SaleCreationModalComponent, { form: 'customer' }, true);
  }
}
