import { ClipboardList, HandshakeIcon, Package, Truck } from "lucide-react";
import { Container } from "~/components/ui/container";

const steps = [
    {
        title: "Request Quote",
        icon: ClipboardList,
        description: "Submit your requirements for a tailored quote",
    },
    {
        title: "Order Placement",
        icon: Package,
        description: "Finalize your order with our B2B specialists",
    },
    {
        title: "Quality Assurance",
        icon: HandshakeIcon,
        description: "Rigorous quality checks before dispatch",
    },
    {
        title: "Secure Delivery",
        icon: Truck,
        description: "Fast and insured shipping to your location",
    },
];

const SupplyProcess = () => {
    return (
        <section className="py-20 bg-white w-full">
            <Container>
                <h2 className="text-3xl font-bold text-center mb-12">
                    Our Seamless{" "}
                    <span className="text-primary">B2B Supply Process</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 p-6 flex flex-col items-center text-center"
                        >
                            <div className="bg-primary/10 p-4 mb-4">
                                <step.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
export default SupplyProcess;
