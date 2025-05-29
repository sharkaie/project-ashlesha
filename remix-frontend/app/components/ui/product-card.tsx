import { Product } from "~/types/product";
import { Card, CardContent } from "~/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="w-full rounded-none border-0 shadow-none ">
            <CardContent className="text-center p-0">
                <div className="aspect-square relative pb-3">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-44 h-44 md:w-80 md:h-80"
                    />
                </div>
                <h3 className="text-lg pb-1">{product.name}</h3>
                <p className="text-primary">${product.price.toFixed(2)}</p>
            </CardContent>
        </Card>
    );
}
