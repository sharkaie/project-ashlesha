import { Link, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunction } from "@remix-run/node";
import {
    Loader2Icon,
    MinusIcon,
    PlusIcon,
    ShoppingCartIcon,
    Trash2,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "~/session.server";
import { Cart } from "~/types/cart";
import { GetCart, removeItemFromCart, updateItemQty } from "~/api/cart-api";
import { useEffect, useState } from "react";
import _ from "lodash";
import confetti from "canvas-confetti";

// Loader to fetch cart items based on session ID
export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const sessionId = session.get("__sid");
    console.log(sessionId);
    if (!sessionId) {
        return json([]);
    }
    return json({ sessionId });
};

export default function CartPage() {
    const [localQuantities, setLocalQuantities] = useState<
        Record<string, number>
    >({});

    // Get Cart using Tansctack query
    const queryClient = useQueryClient();
    const { data: cart, isLoading } = useQuery<Cart>({
        queryKey: ["cart"],
        queryFn: () => GetCart(sessionId),
    });

    const handleClick = () => {
        // Define the heart shape
        const heart = confetti.shapeFromText("❤️");

        const defaults = {
            spread: 90, // Narrow spread for upward motion
            ticks: 200, // Slow animation
            gravity: -0.1, // Hearts float upward
            decay: 0.99, // Slow fading for visibility
            startVelocity: 5, // Gentle upward motion
            shapes: [heart], // Use heart shape
            scalar: 4, // Size of hearts
            colors: ["#ff0000", "#ff4d4d", "#ff6666"], // Shades of red
            rotate: 0, // Prevent flipping or rotating
        };

        const shoot = () => {
            // Emerge hearts from the bottom of the screen
            confetti({
                ...defaults,
                particleCount: 10, // Few hearts at a time for elegance
                origin: {
                    x: Math.random(), // Random horizontal position
                    y: 1, // Always emerge from the bottom
                },
                angle: 90, // Ensure consistent upward motion
            });
        };

        // Fire confetti continuously for 2 seconds
        const interval = setInterval(shoot, 100); // Fire hearts every 200ms
        setTimeout(() => {
            clearInterval(interval); // Stop the animation
            // window.location.href = "https://www.google.com"; // Change to your desired page
        }, 2000); // 2 seconds of animation
    };

    // Sync local quantities with cart items
    useEffect(() => {
        if (cart?.items) {
            const quantities = cart.items.reduce(
                (acc, item) => {
                    acc[item.productId] = item.quantity;
                    return acc;
                },
                {} as Record<string, number>,
            );
            setLocalQuantities(quantities);
        }
    }, [cart]);

    // Debounced function to update quantity on the server
    const debouncedUpdateQuantity = _.debounce(
        (itemId: number, newQuantity: number) => {
            updateCartItemQty.mutate({
                itemId: itemId.toString(),
                qty: newQuantity,
            });
        },
        300,
    );

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        // Ensure the quantity is between 1 and 10
        if (newQuantity < 1 || newQuantity > 10) return;
        setLocalQuantities((prev) => ({
            ...prev,
            [itemId]: newQuantity,
        }));
        debouncedUpdateQuantity(itemId, newQuantity);
    };

    const { sessionId } = useLoaderData<{
        sessionId: string;
    }>();

    // Increment item quantity
    const updateCartItemQty = useMutation({
        mutationFn: async ({
            itemId,
            qty,
        }: {
            itemId: string;
            qty: number;
        }) => {
            await updateItemQty(sessionId, itemId, qty);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["cart"] })
                .then(() => null);
        },
    });

    // remove item from cart
    const removeItem = useMutation({
        mutationFn: async (itemId: string) => {
            await removeItemFromCart(sessionId, itemId);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["cart"] })
                .then(() => null);
        },
    });

    return (
        <div className="w-full bg-gray-100 flex justify-center">
            <div className="container">
                <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">
                        My Cart
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-96">
                            <Loader2Icon className="w-10 h-10 animate-spin text-gray-300" />
                        </div>
                    ) : cart && cart.items !== null ? (
                        <>
                            <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                                <section
                                    aria-labelledby="cart-heading"
                                    className="lg:col-span-7"
                                >
                                    <h2 id="cart-heading" className="sr-only">
                                        Items in your shopping cart
                                    </h2>

                                    <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                                        {cart?.items?.map((item) => (
                                            <li
                                                key={item.productId}
                                                className="flex py-6 sm:py-10"
                                            >
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={
                                                            "Image of " +
                                                            item.name
                                                        }
                                                        className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                                                    />
                                                </div>

                                                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                                    <div className="relative grow pr-9 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:pr-0">
                                                        <div className="flex flex-col justify-between col-span-2">
                                                            <div>
                                                                <div className="flex justify-between">
                                                                    <h3 className="text-sm">
                                                                        <a
                                                                            href={`/collections/${item.productSlug}`}
                                                                            className="font-medium text-lg text-gray-700 hover:text-gray-800"
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </a>
                                                                    </h3>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-900">
                                                                    Limited
                                                                    Edition
                                                                </p>
                                                                {item.ringSize && (
                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {`Ring
                                                                        Size: ${item.ringSize}`}
                                                                    </p>
                                                                )}
                                                                <p className="mt-4 font-medium text-gray-900">
                                                                    ${" "}
                                                                    {item.price}
                                                                </p>

                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-2 mt-6 md:mt-0">
                                                                <p className="mt-1 text-sm text-gray-700">
                                                                    Quantity:{" "}
                                                                </p>
                                                                <div className="border inline-flex justify-evenly items-center">
                                                                    <Button
                                                                        variant="link"
                                                                        size={
                                                                            "icon"
                                                                        }
                                                                        className="p-2 inline-flex text-gray-400 hover:text-gray-500"
                                                                        onClick={() =>
                                                                            handleQuantityChange(
                                                                                item.productId,
                                                                                Math.max(
                                                                                    1,
                                                                                    localQuantities[
                                                                                        item
                                                                                            .productId
                                                                                    ] -
                                                                                        1,
                                                                                ),
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            updateCartItemQty.isPending
                                                                        }
                                                                    >
                                                                        <MinusIcon
                                                                            className="h-6 w-6"
                                                                            aria-hidden="true"
                                                                        />
                                                                        <span className="sr-only">
                                                                            Decrease
                                                                            quantity
                                                                        </span>
                                                                    </Button>
                                                                    <span>
                                                                        {
                                                                            localQuantities[
                                                                                item
                                                                                    .productId
                                                                            ]
                                                                        }
                                                                    </span>
                                                                    <Button
                                                                        variant="link"
                                                                        size={
                                                                            "icon"
                                                                        }
                                                                        className="p-2 inline-flex text-gray-400 hover:text-gray-500"
                                                                        onClick={() =>
                                                                            handleQuantityChange(
                                                                                item.productId,
                                                                                localQuantities[
                                                                                    item
                                                                                        .productId
                                                                                ] +
                                                                                    1,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            updateCartItemQty.isPending
                                                                        }
                                                                    >
                                                                        <PlusIcon
                                                                            className="h-6 w-6"
                                                                            aria-hidden="true"
                                                                        />
                                                                        <span className="sr-only">
                                                                            Increase
                                                                            quantity
                                                                        </span>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-end md:justify-center">
                                                            <Button
                                                                variant="link"
                                                                size={"icon"}
                                                                className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                                                onClick={() =>
                                                                    removeItem.mutate(
                                                                        item.productId.toString(),
                                                                    )
                                                                }
                                                                disabled={
                                                                    removeItem.isPending
                                                                }
                                                            >
                                                                <span className="sr-only">
                                                                    Remove
                                                                </span>
                                                                {removeItem.isPending ? (
                                                                    <Loader2Icon
                                                                        className="h-6 w-6 animate-spin"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <Trash2
                                                                        className="h-6 w-6"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* Order summary */}
                                <section
                                    aria-labelledby="summary-heading"
                                    className="mt-16 bg-gray-50 rounded-none border px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                                >
                                    <h2
                                        id="summary-heading"
                                        className="text-lg font-medium text-gray-900"
                                    >
                                        Order summary
                                    </h2>

                                    <dl className="mt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <dt className=" text-gray-600">
                                                Subtotal
                                            </dt>
                                            <dd className=" font-medium text-gray-900">
                                                $ {cart.subtotal}
                                            </dd>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                            <dt className="text-base font-medium text-gray-900">
                                                Order total{" "}
                                                <span
                                                    className={
                                                        "text-sm text-muted-foreground"
                                                    }
                                                >
                                                    (Incl. Taxes)
                                                </span>
                                            </dt>
                                            <dd className="text-base font-medium text-gray-900">
                                                $ {cart.grandTotal}
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="mt-6 text-center">
                                        <Link
                                            to="/checkout"
                                            className={cn(
                                                buttonVariants({
                                                    variant: "default",
                                                }),
                                                "w-full uppercase rounded-none py-5 px-8 tracking-widest",
                                            )}
                                            onClick={handleClick}
                                        >
                                            Checkout
                                        </Link>
                                    </div>
                                </section>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-96">
                            <ShoppingCartIcon className="w-12 h-12 text-gray-900" />
                            <p className="text-lg md:text-2xl font-medium text-gray-900 ml-4">
                                Your cart is empty
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
