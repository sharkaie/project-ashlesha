import { Container } from "~/components/ui/container";
import { buttonVariants } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";

const CtaSection = () => {
    return (
        <section className="py-24 bg-luxury-500 w-full">
            <Container>
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                        Elevate Your Jewelry Business
                    </h2>
                    <p className="text-xl mb-12 max-w-2xl mx-auto text-white/90">
                        Partner with Ashlesha Jewells for premium natural and
                        lab-grown diamonds to take your offerings to new
                        heights.
                    </p>
                    <a
                        href={
                            "mailto:sales@ashleshajewells.com?subject=Product%20Inquiry&body=Dear%20Support,%0D%0A%0D%0AI%20would%20like%20to%20inquire%20about%20your%20products.%0D%0A%0D%0AProduct Name:%20[Product]%0D%0AQuantity Needed:%20[X]%0D%0A%0D%0AThank%20you,%0D%0A%0D%0AYour%20Name%0D%0AYour%20Company"
                        }
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "text-secondary-foreground px-8 py-3 text-base bg-white hover:bg-luxury-100 rounded-none",
                        )}
                    >
                        Request a Quote <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                </div>
            </Container>
        </section>
    );
};
export default CtaSection;
