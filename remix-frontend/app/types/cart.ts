export type CartItem = {
    name: string;
    price: number;
    productId: number;
    productSlug: string;
    description: string;
    image: string;
    quantity: number;
    ringSize: string;
    shipping: number;
    subtotal: number;
    tax: number;
    total: number;
};

export type Cart = {
    grandTotal: number;
    items: CartItem[];
    shipping: number;
    subtotal: number;
    tax: number;
};

export type AddCartItem = {
    productID: number;
    quantity: number;
    sessionID: string;
    ringSize?: string;
};
