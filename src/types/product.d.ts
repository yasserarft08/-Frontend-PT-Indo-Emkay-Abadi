export interface productInterface {
    id?: number;
    product_name: string;
    category: string;
    price: number;
    discount?: number;
}

export type productList = productInterface[]