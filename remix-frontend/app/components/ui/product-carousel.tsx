import { Product } from "~/types/product";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "~/components/ui/carousel";
import { ProductCard } from "~/components/ui/product-card";

export function ProductCarousel({ products }: { products: Product[] }) {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full container"
        >
            <CarouselContent className="gap-3">
                {products.map((product) => (
                    <CarouselItem
                        key={product.id}
                        className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                        <ProductCard product={product} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:block" />
            <CarouselNext className="hidden md:block" />
        </Carousel>
    );
}
