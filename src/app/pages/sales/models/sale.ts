import { ISaleProduct } from "./sale-product";

export interface ISale {
    id: number;
    customerName: string;
    customerContact: string;
    status: string;
    products: ISaleProduct[];
    paymentValue: number;
    paymentMethod: string;
}
