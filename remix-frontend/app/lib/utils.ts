import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper function to generate a unique session ID
export function generateSessionId(): string {
    return crypto.randomUUID(); // You can replace this with other unique ID generators if needed
}

// <Link
//     to={`/checkout?product=${product.slug}`}
// className={cn(
//       buttonVariants({ variant: "default" }),
//     "max-w-xs flex-1 uppercase rounded-none py-5 px-8 tracking-widest",
// )}
// >
// Checkout
// </Link>