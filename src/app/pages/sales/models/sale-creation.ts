import { ISaleProduct } from "./sale-product";

export interface ISaleCreation {
    customerName: string;
    customerContact: string;
    status: string;
    products: ISaleProduct[];
    paymentValue: number;
    paymentMethod: string;
}
