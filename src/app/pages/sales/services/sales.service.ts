import { Injectable } from "@angular/core";
import { faEdit, faRemove, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { BehaviorSubject, Observable, map, of } from "rxjs";

import { ICrudService } from "../../../commons/services/crud.service";
import { Table } from "../../../commons/table/models/table";
import { TableHeadLine } from "../../../commons/table/models/table-head-line";
import { TableHeadColumn } from "../../../commons/table/models/table-head-column";
import { TableRowLine } from "../../../commons/table/models/table-row-line";
import { Button } from "../../../commons/button/models/button";
import { TableColumn } from "../../../commons/table/models/table-column";
import { TableColumnActions } from "../../../commons/table/models/table-column-actions";
import { TableColumnStatus } from "../../../commons/table/models/table-column-status";
import { SalesStatus } from "../models/sales-status";
import { TableColumnCurrency } from "../../../commons/table/models/table-column-currency";
import { TableColumnPhone } from "../../../commons/table/models/table-column-phone";
import { TableColumnQuantity } from "../../../commons/table/models/table-column-quantity";
import { ButtonType } from "../../../commons/button/models/button-type";
import { DialogService } from "../../../commons/dialog/services/dialog.service";
import { SaleEditService } from "./sale-edit.service";
import { ISale } from "../models/sale";
import { ISaleCreation } from "../models/sale-creation";
import { ISaleCustomer } from "../models/sale-customer";
import { ISalePayment } from "../models/sale-payment";
import { ISaleProduct } from "../models/sale-product";
import { ModalService } from "../../../commons/modal/services/modal.service";
import { RefundModalComponent } from "../components/refund-modal.component";
import { IProductRefundOptions } from "../models/product-refund-options";

@Injectable({
    providedIn: 'root'
})
export class SalesService implements ICrudService<ISale> {
    private isEdit: boolean = false;
    private saleId: number = 0;
    private products: ISaleProduct[] = [];
    private payment?: ISalePayment;
    private customer?: ISaleCustomer;

    private readonly $sales: BehaviorSubject<ISale[]> = new BehaviorSubject<ISale[]>([]);

    constructor(
        private readonly dialogService: DialogService,
        private readonly modalService: ModalService,
        private readonly saleEditService: SaleEditService
    ) {
        this.$sales.next(this.getSales());
    }

    public async createProduct(product: ISaleProduct) {
        if (!product 
            || !product.name 
            || !product.value
            || !product.quantity) {
            throw Error('Produto adicionado é inválido');
        }

        this.products.push(product);

        return Promise.resolve();
    }

    public async updateProduct(saleId: number, product: ISaleProduct) {
        this.isEdit = true;
        this.saleId = saleId;
        this.createProduct(product);
        return Promise.resolve();
    }

    public async createPayment(payment: ISalePayment) {
        if (!payment 
            || !payment.paymentMethod
            || !payment.status) {
            throw Error('Pagamento inválido');
        }

        this.payment = payment;

        return Promise.resolve();
    }

    public async updatePayment(saleId: number, payment: ISalePayment) {
        this.isEdit = true;
        this.saleId = saleId;
        this.createPayment(payment);
        return Promise.resolve();
    }

    public async createCustomer(customer: ISaleCustomer) {
        if (!customer 
            || !customer.customerName
            || !customer.customerContact) {
            throw Error('Cliente inválido');
        }

        this.customer = customer;

        return Promise.resolve();
    }

    public async updateCustomer(saleId: number, customer: ISaleCustomer) {
        this.isEdit = true;
        this.saleId = saleId;
        this.createCustomer(customer);
        return Promise.resolve();
    }

    public updateOrCreate(): Observable<Response> {
        const item: ISaleCreation = {
            customerContact: this.customer!.customerContact,
            customerName: this.customer!.customerName,
            paymentMethod: this.payment!.paymentMethod,
            products: this.products,
            status: this.payment!.status
        };

        if (!this.isEdit) {
            this.create(item);
        } else {
            this.update(this.saleId, item);
        }

        this.isEdit = false;
        this.saleId = 0;
        this.customer = undefined;
        this.payment = undefined;
        this.products = [];

        return this.commit();
    }

    public commit(): Observable<Response> {
        const sales = this.$sales.value;

        localStorage.setItem('sales', JSON.stringify(sales));
        
        return of(new Response());
    }
    
    public readProducts(saleId: number): Observable<ISaleProduct[]> {
        return this.$sales.pipe(map(sales => {
            const sale = sales.find(s => s.id == saleId);

            return sale?.products ?? [];
        }));
    }

    public readPayment(saleId: number): Observable<ISalePayment|null> {
        return this.$sales.pipe(map(sales => {
            const sale = sales.find(s => s.id == saleId);

            if (!sale) {
                return null;
            }

            return {
                paymentMethod: sale.paymentMethod,
                status: sale.status
            };
        }));
    }

    public readCustomer(saleId: number): Observable<ISaleCustomer|null> {
        return this.$sales.pipe(map(sales => {
            const sale = sales.find(s => s.id == saleId);

            if (!sale) {
                return null;
            }

            return {
                customerName: sale.customerName,
                customerContact: sale.customerContact
            };
        }));
    }
    
    public readAll(): Observable<Table> {
        return this.$sales.pipe(map(sales => 
            new Table(
                [
                    new TableHeadLine(1, 
                    [
                        new TableHeadColumn(1, 'Venda'),
                        new TableHeadColumn(2, 'Cliente'),
                        new TableHeadColumn(3, 'Status'),
                        new TableHeadColumn(4, 'Contato'),
                        new TableHeadColumn(5, 'Valor'),
                        new TableHeadColumn(6, 'Forma de Pagamento'),
                        new TableHeadColumn(7, 'Ações')
                    ])
                ], 
                [
                    ...sales.map(s => new TableRowLine(s.id, 
                    [
                        new TableColumn(1, s.id.toString()),
                        new TableColumn(2, s.customerName),
                        new TableColumnStatus(3, { status: new SalesStatus(s.status).status }),
                        new TableColumnPhone(4, { phone: s.customerContact, copy: true }),
                        new TableColumnCurrency(5, { value: s.products.map(p => p.value).reduce((a, b) => a + b, 0) }),
                        new TableColumn(6, s.paymentMethod),
                        new TableColumnActions(7, { actionButtons: [
                            new Button(async () => {
                                    await this.modalService.open<RefundModalComponent, IProductRefundOptions>(
                                        RefundModalComponent, 
                                        {
                                            saleId: s.id,
                                            products: s.products.map(p => (
                                                { 
                                                    name: `${p.name} - QTD: ${p.quantity}`, 
                                                    value: p.name,
                                                    quantity: p.quantity 
                                                }))
                                        });
                                },
                                '', 
                                faRotateLeft, 
                                ButtonType.primary, 
                                s.status.toLowerCase() === 'devolvido',
                                s.status.toLowerCase() === 'devolvido' ? 'Item devolvido não pode ser modificado' : 'Devolver'),
                            new Button(() => 
                                this.saleEditService.edit(s.id), 
                                '', 
                                faEdit, 
                                ButtonType.primary, 
                                s.status.toLowerCase() === 'devolvido',
                                s.status.toLowerCase() === 'devolvido' ? 'Item devolvido não pode ser modificado' : 'Editar'),
                            new Button(async () => {
                                    const confirm = await this.dialogService.open({
                                        id: s.id,
                                        title: 'Deletar venda',
                                        content: `Deseja realmente deletar a venda ${s.id} para o(a) cliente ${s.customerName}?`
                                    });

                                    if (confirm) {
                                        this.delete(s.id);
                                    }
                                }, 
                                '', 
                                faRemove, 
                                ButtonType.danger, 
                                s.status.toLowerCase() === 'devolvido',
                                s.status.toLowerCase() === 'devolvido' ? 'Item devolvido não pode ser modificado' : 'Deletar')
                        ]})
                    ])),
                    this.getTotal(sales)
                ])));
    }
    
    public update(id: number, item: ISaleCreation): Observable<Response> {
        const sales = this.$sales.value;
        const saleIndex = sales.findIndex(s => s.id == id);

        if (saleIndex == -1)
            throw new Error('Item inválido para edição');
        
        sales[saleIndex] = {
            customerContact: item.customerContact,
            customerName: item.customerName,
            id: id,
            paymentMethod: item.paymentMethod,
            products: item.products,
            status: item.status
        };

        this.$sales.next(sales);

        return of(new Response());
    }

    public create(item: ISaleCreation) {
        const sales = this.$sales.value;
        const id = (sales[sales.length - 1]?.id ?? 0) + 1;
        const sale = { id, ...item };
        sales.push(sale);
        this.$sales.next(sales);

        const salesStorage = this.getSales();
        salesStorage.push(sale);
    }
    
    public delete(id: number): Observable<Response> {
        const sales = this.$sales.value;
        const salesWithoutDeletedItem = sales.filter(s => s.id != id);

        this.$sales.next(salesWithoutDeletedItem);

        this.updateOrCreate();

        return of(new Response());
    }

    public refund(id: number, productsRefund: { name: string, qty: number }[]) {
        const sales = this.$sales.value;
        const saleIndex = sales.findIndex(s => s.id == id);
        const sale = sales.find(s => s.id == id);
        const newSale = Object.assign({}, sales.find(s => s.id == id));

        if (!sale) {
            throw new Error('Sale not found');
        }
        
        const productsWithoutRefund = sale.products.filter(p => {
            const productRefund = productsRefund.find(pr => pr.name.toLowerCase() == p.name.toLowerCase()); 

            if (!productRefund) {
                return true;
            }
            
            if (+productRefund.qty < +p.quantity) {
                return true;
            }

            return false;
        }).map(p => {
            const productRefund = productsRefund.find(pr => pr.name.toLowerCase() == p.name.toLowerCase()); 
            const pCopy = {...p};
            if (!productRefund) {
                return pCopy;
            }

            if (+productRefund.qty < +pCopy.quantity) {
                pCopy.quantity -= productRefund.qty;
                const unitValue = +p.value / +p.quantity;
                pCopy.value = unitValue * +pCopy.quantity;
            }

            return pCopy;
        });
        
        const newProductsRefund = sale.products.filter(p => {
            const productRefund = productsRefund.find(pr => pr.name.toLowerCase() == p.name.toLowerCase()); 

            if (!productRefund) {
                return false;
            }
            
            if (+productRefund.qty < +p.quantity) {
                return true;
            }

            return true;
        }).map(p => {
            const productRefund = productsRefund.find(pr => pr.name.toLowerCase() == p.name.toLowerCase()); 
            const pCopy = {...p};
            if (!productRefund) {
                return pCopy;
            }

            if (+productRefund.qty < +pCopy.quantity) {
                pCopy.quantity = productRefund.qty;
                const unitValue = +p.value / +p.quantity;
                pCopy.value = unitValue * +productRefund.qty;
            }

            return pCopy;
        });

        sale.products = productsWithoutRefund;

        if (!sale.products.length) {
            sales.splice(saleIndex, 1);
        }
        
        newSale.products = newProductsRefund;
        newSale.status = 'Devolvido';
        newSale.id = sales.map(s => s.id).sort().reverse()[0] + 1;
        sales.push(newSale);
        this.$sales.next(sales);

        this.commit();
    }

    private getTotal(sales: ISale[]) {
        const completedSales = sales.filter(s => s.status.toLowerCase() == 'pago');
        const total = {
            qty: completedSales.flatMap(s => s.products.map(p => +p.quantity) ?? [0]).reduce((a, b) => a + b, 0),
            value: completedSales.flatMap(s => s.products.map(p => p.value)).reduce((a, b) => a + b, 0),
        };

        return new TableRowLine(
            9999, 
            [
                new TableColumn(1, 'Total: '),
                new TableColumnQuantity(2, { quantity: total.qty }, 'Quantidade'),
                new TableColumn(3, ''),
                new TableColumn(4, ''),
                new TableColumn(5, ''),
                new TableColumn(6, ''),
                new TableColumnCurrency(7, { value: total.value }, 'Valor')
            ],
            true);
    }

    private getSales(): ISale[] {
        const sales = localStorage.getItem('sales') ?? '[]';
        return JSON.parse(sales);
    }
}