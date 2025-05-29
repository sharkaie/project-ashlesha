// type Props = {};
import { Cart } from "~/types/cart";
import { Button } from "~/components/ui/button";
import { Loader2Icon } from "lucide-react";

const CheckoutOrderSummary = ({
    isSubmitting,
    cart,
}: {
    isSubmitting: boolean;
    cart: Cart;
}) => {
    const cartItems = cart.items;
    return (
        <>
            <div className="mt-10 lg:mt-0">
                <h2 className="text-lg font-medium text-gray-900">
                    Order summary
                </h2>

                <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="sr-only">Items in your cart</h3>
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <li
                                key={item.name + item.productId}
                                className="flex py-6 px-4 sm:px-6"
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src={
                                            item.image ||
                                            "https://dummyimage.com/250x250"
                                        }
                                        alt={
                                            "Image of " + item.name || "Product"
                                        }
                                        className="w-20 rounded-md"
                                    />
                                </div>

                                <div className="ml-6 flex-1 flex flex-col">
                                    <div className="flex">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm">
                                                <a
                                                    href={`/collections/${item.productSlug}`}
                                                    className="font-medium text-gray-700 hover:text-gray-800"
                                                >
                                                    {item.name}
                                                </a>
                                            </h4>
                                            {item.ringSize && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Size: {item.ringSize}
                                                </p>
                                            )}
                                            {/*<p className="mt-1 text-sm text-gray-500">*/}
                                            {/*    {item.product.weight}*/}
                                            {/*</p>*/}
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-2 flex items-end justify-between">
                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            $ {item.price}
                                        </p>

                                        <div className="ml-4">
                                            <p>
                                                <span className="font-medium">
                                                    Qty
                                                </span>
                                                : {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">
                                $ {cart.subtotal}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-sm">Shipping</dt>
                            <dd className="text-sm font-medium text-gray-900">
                                $ 18.00
                                {/*$ {cart.shipping}*/}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                            <dt className="text-base font-medium">
                                Total{" "}
                                <span className="text-muted-foreground text-sm">
                                    (incl. taxes)
                                </span>
                            </dt>
                            <dd className="text-base font-medium text-gray-900">
                                $ {cart.grandTotal + 18}
                            </dd>
                        </div>
                    </dl>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <Button
                            variant="default"
                            className="rounded-none w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2Icon className="w-5 h-5 animate-spin" />
                                    Please wait...
                                </div>
                            ) : (
                                "Confirm Order"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CheckoutOrderSummary;
