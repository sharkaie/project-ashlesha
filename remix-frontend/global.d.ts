declare global {
    interface Window {
        Razorpay?: {
            new (options: RazorpayOptions): RazorpayInstance;
        };
    }

    namespace NodeJS {
        interface ProcessEnv {
            SESSION_SECRET: string;
            NODE_ENV: "development" | "production" | "test";
        }
    }
}

interface RazorpayOptions {
    key: string;
    amount: number; // Amount in paise
    currency: string;
    name: string;
    description: string;
    order_id: string; // Order ID from the backend
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
}

export {};
