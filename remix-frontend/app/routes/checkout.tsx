import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    CheckoutFormSchema,
    CheckoutFormValues,
} from "~/form-schemas/checkout-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import { Textarea } from "~/components/ui/textarea";
import CheckoutOrderSummary from "~/components/checkout-order-summary";
import { LoaderFunction } from "@remix-run/node";
import { Cart } from "~/types/cart";
import { GetUserSessionCart } from "~/loaders/get-user-session-cart";

// Loader to fetch cart items based on session ID
export const loader: LoaderFunction = async ({ request }) => {
    return await GetUserSessionCart(request);
};

export default function CartPage() {
    const { cart, sessionId } = useLoaderData<{
        cart: Cart;
        sessionId: string;
    }>();
    const navigate = useNavigate();

    // Redirect to "/cart" if no items are in the cart
    useEffect(() => {
        if (!cart?.items || cart.items.length === 0) {
            window.location.href = "/cart";
        }
    }, [cart, navigate]);

    // Form setup and other logic
    const APP_SERVER_URL = "https://api.ashleshajewells.com"; // Replace with your server URL
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(CheckoutFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: undefined,
            phone: "",
            email: "",
            shippingAddress: {
                streetAddress: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            },
            billingAddress: {
                streetAddress: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            },
            notes: "",
        },
    });
    const {
        streetAddress: shippingStreetAddress,
        city: shippingCity,
        state: shippingState,
        postalCode: shippingPostalCode,
        country: shippingCountry,
    } = form.watch("shippingAddress");
    useEffect(() => {
        if (billingSameAsShipping) {
            form.setValue("billingAddress", form.getValues("shippingAddress"));
        }
    }, [
        billingSameAsShipping,
        form,
        shippingStreetAddress,
        shippingCity,
        shippingState,
        shippingPostalCode,
        shippingCountry,
    ]);

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);

        const formData = {
            ...data,
            sessionId,
        };
        try {
            const response = await axios.post(
                `${APP_SERVER_URL}/api/checkout`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                },
            );

            if (response.status === 200) {
                const { paymentLink } = response.data;
                toast.success("Redirecting to payment gateway...");
                window.location.href = paymentLink;
            } else {
                toast.error("Something went wrong. Please try again.");
                console.error("Form submission failed!", response.status);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!cart?.items || cart.items.length === 0) {
        // Optionally, render a fallback while redirecting
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Loader2Icon className="w-10 h-10 animate-spin text-gray-300" />
            </div>
        );
    }
    return (
        <div className="w-full bg-gray-100 flex justify-center">
            <div className="bg-gray-100 container w-full">
                <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Checkout</h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
                        >
                            <div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Contact information
                                    </h2>

                                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            First Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="rounded-none bg-white"
                                                                placeholder="John"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Last Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="rounded-none bg-white"
                                                                placeholder="Doe"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                className="rounded-none bg-white"
                                                                placeholder="example@example.com"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="dateOfBirth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Date Of Birth
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                className="rounded-none bg-white flex"
                                                                placeholder="DD-MM-YYYY"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Mobile Number
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="tel"
                                                                className="rounded-none bg-white"
                                                                placeholder="+1 405 555 0123"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 border-t border-gray-200 pt-10">
                                    <h2 className="text-xl font-medium text-gray-900">
                                        Shipping information
                                    </h2>

                                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        <div className="sm:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="shippingAddress.streetAddress"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Street Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                className="rounded-none bg-white"
                                                                placeholder="123 Main Street"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="shippingAddress.city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            City
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="rounded-none bg-white"
                                                                placeholder="City"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="shippingAddress.country"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Country
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="rounded-none bg-white"
                                                                placeholder="Country"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="shippingAddress.state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            State/Province
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="rounded-none bg-white"
                                                                placeholder="State/Province"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="shippingAddress.postalCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Postal Code
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="rounded-none bg-white"
                                                                placeholder="Postal Code"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 border-t border-gray-200 pt-10">
                                    <div className="flex items-center space-x-2 pb-8">
                                        <Checkbox
                                            id="billingSameAsShipping"
                                            checked={billingSameAsShipping}
                                            onCheckedChange={() =>
                                                setBillingSameAsShipping(
                                                    (prev) => !prev,
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="billingSameAsShipping"
                                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Same as shipping information
                                        </label>
                                    </div>
                                    {!billingSameAsShipping && (
                                        <>
                                            <h2 className="text-xl font-medium text-gray-900">
                                                Billing information
                                            </h2>

                                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                                <div className="sm:col-span-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="billingAddress.streetAddress"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Street
                                                                    Address
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        className="rounded-none bg-white"
                                                                        placeholder="123 Main Street"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <FormField
                                                        control={form.control}
                                                        name="billingAddress.city"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    City
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        className="rounded-none bg-white"
                                                                        placeholder="City"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <FormField
                                                        control={form.control}
                                                        name="billingAddress.country"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Country
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        className="rounded-none bg-white"
                                                                        placeholder="Country"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <FormField
                                                        control={form.control}
                                                        name="billingAddress.state"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    State/Province
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        className="rounded-none bg-white"
                                                                        placeholder="State/Province"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div>
                                                    <FormField
                                                        control={form.control}
                                                        name="billingAddress.postalCode"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Postal Code
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        className="rounded-none bg-white"
                                                                        placeholder="Postal Code"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Order summary */}
                            {cart.items && (
                                <CheckoutOrderSummary
                                    isSubmitting={isSubmitting}
                                    cart={cart}
                                />
                            )}
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
