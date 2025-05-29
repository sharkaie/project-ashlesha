import { Container } from "~/components/ui/container";
import { buttonVariants } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-luxury-100 py-32 sm:py-40 w-full">
            <img
                src="/images/diamonds/landing-final.png"
                alt="Diamond background"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <Container className="relative">
                <div className="max-w-7xl flex flex-col w-full">
                    <h1 className="text-5xl font-serif font-bold tracking-tight text-secondary sm:text-6xl mb-6">
                        Exquisite Diamonds for <br />
                        <span className="text-luxury-500">
                            Timeless Elegance
                        </span>
                    </h1>
                    <p className="mt-6 text-xl leading-8 text-secondary/80">
                        Discover our curated collection of premium natural and
                        lab-grown diamonds,
                        <br />
                        crafted to perfection for the discerning jeweler.
                    </p>
                    <div className="mt-12 flex items-center justify-start gap-x-6">
                        <Link
                            to={"/catalog"}
                            className={cn(
                                buttonVariants({
                                    variant: "default",
                                }),
                                "text-white md:px-8 px-6 py-1 md:py-3 text-sm md:text-base bg-luxury-500 hover:bg-luxury-600 rounded-none",
                            )}
                        >
                            Explore Catalog{" "}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to={"/services"}
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                }),
                                "text-white md:px-8 px-6 py-1 md:py-3 text-sm md:text-base bg-transparent border border-white hover:bg-white hover:text-luxury-500 rounded-none",
                            )}
                        >
                            Our Services
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
};
export default HeroSection;
