import { useEffect, useState } from "react";
import { Separator } from "~/components/ui/separator";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "~/components/ui/carousel";
import { Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "~/types/product";

const OurCollection = () => {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const { data, isLoading: isLoadingProducts } = useQuery<{
        data: {
            limit: number;
            page: number;
            products: Product[];
        };
    }>({
        queryKey: ["cart"],
        queryFn: async () => {
            return await axios.get(
                "https://api.ashleshajewells.com/api/products",
            );
        },
    });

    const [currentSlide, setCurrentSlide] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);

    useEffect(() => {
        if (!api) return;

        // Initialize total slides and set current slide
        setTotalSlides(api.scrollSnapList().length);
        setCurrentSlide(api.selectedScrollSnap());

        // Define event handler
        const handleSelect = () => setCurrentSlide(api.selectedScrollSnap());

        // Add the event listener
        api.on("select", handleSelect);

        // Cleanup event listener on unmount
        return () => {
            api.off("select", handleSelect);
        };
    }, [api]);

    return (
        <section className="flex-1 flex flex-col w-full">
            <div id="our-collection" className="container mx-auto px-4 py-16">
                <div className="flex justify-center items-center gap-4">
                    <Separator className="w-full max-w-32 md:block hidden" />
                    <h2 className="text-3xl md:text-4xl text-center h-full">
                        Our Collections
                    </h2>
                    <Separator className="w-full max-w-32 md:block hidden" />
                </div>
                <p className="text-center text-base md:text-lg text-gray-600 mt-2">
                    Explore our exclusive collections
                </p>
                {isLoadingProducts ? (
                    <p>Loading...</p>
                ) : data?.data?.products ? (
                    <div className="py-10">
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full container"
                        >
                            <CarouselContent className="-ml-2">
                                {data?.data.products.map((product) => (
                                    <CarouselItem
                                        key={product.ID + "-product"}
                                        className="basis-1/2 md:basis-1/3 lg:basis-1/4 text-center"
                                    >
                                        <Link
                                            to={`/collections/${product.slug}`}
                                        >
                                            <div className="block">
                                                <div className="aspect-square relative pb-3">
                                                    <img
                                                        src={
                                                            product.images[0]
                                                                ?.src
                                                        }
                                                        alt={
                                                            product.images[0]
                                                                ?.alt
                                                        }
                                                        loading="lazy"
                                                        className="object-cover w-44 h-44 md:w-11/12 md:h-auto"
                                                    />
                                                </div>
                                                <span className="text-lg md:text-xl font-bold text-neutral-700 pb-1 mr-3">
                                                    {product.name}
                                                </span>
                                                <p className="text-muted-foreground font-medium">
                                                    $ {product.price}
                                                </p>
                                            </div>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <div className="flex justify-center mt-4 space-x-2">
                            {Array.from({ length: totalSlides }).map(
                                (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => api?.scrollTo(index)}
                                        className={`w-1.5 h-1.5 rounded-none transition-all ${
                                            currentSlide === index
                                                ? "bg-neutral-800"
                                                : "border border-neutral-400"
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                ) : (
                    "No products found"
                )}
            </div>
        </section>
    );
};

export default OurCollection;
