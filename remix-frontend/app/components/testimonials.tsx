import { Container } from "~/components/ui/container";
import { Star, UserIcon } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        company: "Elegant Jewelers",
        content:
            "The quality and consistency of the lab-grown diamonds we receive are exceptional. Our customers love the ethical sourcing and competitive pricing.",
    },
    {
        name: "Michael Chen",
        company: "Luxe Diamonds Co.",
        content:
            "Their B2B support team is top-notch. They've helped us streamline our supply chain and improve our product offerings significantly.",
    },
    {
        name: "Emma Rodriguez",
        company: "Modern Gems",
        content:
            "The variety of cuts and sizes available has allowed us to expand our collection and cater to a wider range of customers. Highly recommended!",
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-gray-50 w-full">
            <Container>
                <h2 className="text-3xl font-bold text-center mb-12">
                    What Our <span className="text-primary">B2B Partners</span>{" "}
                    Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 bg-white p-6"
                        >
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="text-primary h-5 w-5 fill-current"
                                    />
                                ))}
                            </div>
                            <p className="mb-6 text-gray-600 italic">
                                &#34;{testimonial.content}&#34;
                            </p>
                            <div className="flex items-center">
                                <UserIcon
                                    className={"h-6 w-6 text-primary mr-4"}
                                />
                                <div>
                                    <p className="font-semibold">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
export default Testimonials;
