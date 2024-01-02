import { Injectable } from "@angular/core";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
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

export interface ISale {
    id: number;
    customerName: string;
    customerContact: string;
    state: string;
    products: ISaleProduct[];
    paymentValue: number;
    paymentMethod: string;
}

export interface ISaleCustomer {
    customerName: string;
    customerContact: string;
}

export interface ISalePayment {
    state: string;
    paymentValue: number;
    paymentMethod: string;
}

export interface ISaleProduct {
    name: string;
    quantity: number;
}

export interface ISaleCreation {
    customerName: string;
    customerContact: string;
    state: string;
    products: ISaleProduct[];
    paymentValue: number;
    paymentMethod: string;
}

@Injectable()
export class SalesService implements ICrudService<ISale> {
    private readonly products: ISaleProduct[] = [];
    private readonly payment: ISalePayment = {
        paymentMethod: '',
        paymentValue: 0,
        state: ''
    };
    private readonly customer: ISaleCustomer = {
        customerContact: '',
        customerName: ''
    };

    private readonly $sales: BehaviorSubject<ISale[]> = new BehaviorSubject<ISale[]>([]);

    constructor() {
        this.$sales.next(this.getSalesFromStorage());
    }

    public async createProduct(product: ISaleProduct) {
        if (!product 
            || !product.name 
            || !product.quantity) {
            throw Error('Produto adicionado é inválido');
        }

        this.products.push(product);

        return Promise.resolve();
    }

    public async createPayment(payment: ISalePayment) {
        if (!payment 
            || !payment.paymentMethod 
            || !payment.paymentValue 
            || !payment.state) {
            throw Error('Pagamento inválido');
        }

        this.payment.paymentMethod = payment.paymentMethod;
        this.payment.paymentValue = payment.paymentValue;
        this.payment.state = payment.state;

        return Promise.resolve();
    }

    public async createCustomer(customer: ISaleCustomer) {
        if (!customer 
            || !customer.customerName
            || !customer.customerContact) {
            throw Error('Cliente inválido');
        }

        this.customer.customerContact = customer.customerContact;
        this.customer.customerName = customer.customerName;

        return Promise.resolve();
    }


    public commit(): Observable<Response> {
        const item: ISaleCreation = {
            customerContact: this.customer.customerContact,
            customerName: this.customer.customerName,
            paymentMethod: this.payment.paymentMethod,
            paymentValue: this.payment.paymentValue,
            products: this.products,
            state: this.payment.state
        };

        const sales = this.$sales.value;
        const id = (sales[sales.length - 1]?.id ?? 0) + 1;
        const sale = { id, ...item }
        sales.push(sale);
        this.$sales.next(sales);

        const salesStorage = this.getSalesFromStorage();
        salesStorage.push(sale);
        localStorage.setItem('sales', JSON.stringify(salesStorage));

        return of(new Response());
    }
    
    public read(id: number): Observable<ISale | undefined> {
        return this.$sales.pipe(map(sales => sales.find(s => s.id == id)));
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
                        new TableColumnStatus(3, { status: new SalesStatus(s.state).status }),
                        new TableColumnPhone(4, { phone: s.customerContact }),
                        new TableColumnCurrency(5, { value: s.paymentValue }),
                        new TableColumn(6, s.paymentMethod),
                        new TableColumnActions(7, { actionButtons: [
                            new Button(() => this.returnOfAnItem(s.id), '', faRotateLeft)
                        ]})
                    ])),
                    this.getTotal(sales)
                ])));
    }
    
    public update(id: number, item: ISale): Observable<Response> {
        throw new Error("Method not implemented.");
    }
    
    public delete(id: number): Observable<Response> {
        throw new Error("Method not implemented.");
    }

    private returnOfAnItem(id: number) {
        const sales = this.$sales.value;
        const sale = sales.find(s => s.id == id);

        if (!sale) {
            throw new Error('Sale not found');
        }

        sale.state = 'Devolvido';
        this.$sales.next(sales);
    }

    private getTotal(sales: ISale[]) {
        const total = {
            qty: sales.flatMap(s => s.products?.map(p => +p.quantity) ?? [0]).reduce((a, b) => a + b, 0),
            value: sales.map(s => s.paymentValue).reduce((a, b) => a + b, 0),
        };

        return new TableRowLine(9999, 
            [
                new TableColumn(1, 'Total: '),
                new TableColumn(2, '-'),
                new TableColumn(3, '-'),
                new TableColumnQuantity(4, { quantity: total.qty }),
                new TableColumnCurrency(5, { value: total.value }),
                new TableColumn(6, '-'),
                new TableColumnCurrency(7, { value: total.value })
            ]);
    }

    private getSalesFromStorage(): ISale[] {
        const sales = localStorage.getItem('sales') ?? '[]';
        return JSON.parse(sales);
    }
}