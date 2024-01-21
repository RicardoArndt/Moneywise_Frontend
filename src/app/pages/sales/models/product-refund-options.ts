export interface IProductRefundOptions {
    saleId: number;
    products: { name: string, value: string, quantity: number }[];
}