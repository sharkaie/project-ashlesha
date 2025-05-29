import {
    CheckCircle,
    DollarSign,
    Gem,
    HeadsetIcon as HeadSet,
    ShieldCheck,
    Truck,
} from "lucide-react";
import { Container } from "~/components/ui/container";

const benefits = [
    {
        title: "Premium Quality",
        description:
            "Ethically sourced natural and lab-grown diamonds of the highest quality",
        icon: Gem,
    },
    {
        title: "Competitive Pricing",
        description: "Wholesale rates that boost your profit margins",
        icon: DollarSign,
    },
    {
        title: "Fast Delivery",
        description: "Efficient shipping to meet your deadlines",
        icon: Truck,
    },
    {
        title: "Expert Support",
        description: "Dedicated B2B team for personalized assistance",
        icon: HeadSet,
    },
    {
        title: "Customization",
        description: "Tailored solutions for your specific needs",
        icon: CheckCircle,
    },
    {
        title: "Certified Authenticity",
        description: "Every diamond comes with certification",
        icon: ShieldCheck,
    },
];

const B2BBenefits = () => {
    return (
        <section className="py-24 bg-luxury-100 w-full">
            <Container>
                <h2 className="text-4xl font-bold text-center mb-16">
                    Why Choose Ashlesha Jewells for{" "}
                    <span className="text-luxury-500">B2B Excellence</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start">
                            <benefit.icon className="text-luxury-500 mr-4 h-8 w-8 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-secondary-foreground/70">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
export default B2BBenefits;
