import { ISaleProduct } from "./sale-product";

export interface ISale {
    id: number;
    customerName: string;
    customerContact: string;
    status: string;
    products: ISaleProduct[];
    paymentMethod: string;
}
