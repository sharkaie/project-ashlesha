import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { Link } from "@remix-run/react";

const Hero = () => {
    return (
        <section className="relative w-full">
            <img
                src="https://res.cloudinary.com/dsnud8jwh/image/upload/f_auto,q_auto/ashlesha-hero-img-d"
                className="hidden md:block w-full h-96 md:h-[600px] object-cover"
                alt="Diamond ring ashlesha jewells"
                loading={"lazy"}
            />
            <img
                src="https://res.cloudinary.com/dsnud8jwh/image/upload/f_auto,q_auto/hero-mobile"
                className="md:hidden w-full h-96 md:h-[600px] object-cover"
                alt="Diamond ring ashlesha jewells"
                loading={"lazy"}
            />
            <div className="absolute inset-0 w-full items-center">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="container flex flex-col md:gap-6 gap-2 px-6 md:px-0">
                        <h1 className="text-neutral-50 text-3xl md:text-5xl">
                            Timeless Brilliance,
                            <br />
                            Crafted for the Elite.
                        </h1>
                        <p className="text-base md:text-xl text-neutral-50">
                            Partner with Us
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/collections/luxe-aura"
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "border border-neutral-50 text-neutral-50 rounded-none bg-transparent",
                                )}
                            >
                                Contact Us Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Hero;
