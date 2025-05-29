import { CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { cn } from "~/lib/utils";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();

    const paymentId = searchParams.get("razorpay_payment_id");
    const paymentStatus = searchParams.get("razorpay_payment_link_status");

    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Payment Successful
                    </h1>
                    <p className="text-gray-600">
                        Thank you for your purchase! Your payment has been
                        successfully processed.
                    </p>
                    <table className="w-full border border-gray-200 bg-gray-100 rounded-md text-left text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-2 font-bold text-gray-700">
                                    Payment ID
                                </th>
                                <td className="px-4 py-2 text-gray-900">
                                    {paymentId || "N/A"}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-2 font-bold text-gray-700">
                                    Payment Status
                                </th>
                                <td className="px-4 py-2">
                                    <Badge
                                        variant="default"
                                        className={cn(
                                            "uppercase",
                                            paymentStatus === "paid" &&
                                                "bg-green-100 text-green-800 hover:bg-green-200",
                                            paymentStatus === "Cancelled" &&
                                                "bg-red-100 text-red-800 hover:bg-red-200",
                                            paymentStatus === "Expired" &&
                                                "bg-gray-100 text-gray-800 hover:bg-gray-200",
                                        )}
                                    >
                                        {paymentStatus || "N/A"}
                                    </Badge>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="space-y-4">
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={() => (window.location.href = "/")}
                        >
                            Go to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
