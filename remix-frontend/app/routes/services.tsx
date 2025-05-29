import { Container } from "~/components/ui/container";
import { CheckCircle } from "lucide-react";

const services = [
    {
        title: "Custom Diamond Sourcing",
        description:
            "Tailored selection of natural and lab-grown diamonds to your exact specifications, ensuring a perfect fit for your designs.",
    },
    {
        title: "Bulk Order Fulfillment",
        description:
            "Efficiently process and deliver large-scale orders to meet your production needs, with competitive wholesale pricing.",
    },
    {
        title: "Quality Assurance",
        description:
            "Rigorous testing and certification for every diamond we provide, guaranteeing authenticity and quality.",
    },
    {
        title: "Design Consultation",
        description:
            "Expert advice on selecting the right diamonds for your jewelry collections, considering current market trends and consumer preferences.",
    },
    {
        title: "Market Trend Analysis",
        description:
            "Stay ahead of the curve with our insights into the latest diamond and jewelry trends, helping you make informed decisions for your business.",
    },
    {
        title: "Logistics Support",
        description:
            "Secure and timely delivery of your orders, with full tracking and insurance, ensuring your peace of mind.",
    },
];

const ServicesPage = () => {
    return (
        <div className="py-24 w-full">
            <Container>
                <h1 className="text-5xl  font-bold mb-12 text-center">
                    Our <span className="text-luxury-500">B2B Services</span>
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <img
                            src="/images/diamonds/services.png"
                            alt="Ashlesha Jewells services"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-6">
                            Elevate Your Jewelry Business
                        </h2>
                        <p className="text-lg mb-6">
                            At Ashlesha Jewells, we offer a comprehensive suite
                            of B2B services designed to support and enhance your
                            jewelry business. From sourcing the finest natural
                            and lab-grown diamonds to providing expert market
                            insights, we&#39;re here to help you succeed in the
                            competitive world of luxury jewelry.
                        </p>
                        <p className="text-lg">
                            Our team of experienced professionals is dedicated
                            to delivering personalized solutions that meet your
                            unique business needs, ensuring that you can offer
                            your customers the very best in diamond jewelry.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="border border-luxury-200 p-6 rounded-lg"
                        >
                            <CheckCircle className="h-8 w-8 text-luxury-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                {service.title}
                            </h3>
                            <p className="text-secondary-foreground/70">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};
export default ServicesPage;
