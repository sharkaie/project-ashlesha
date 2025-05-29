import { Container } from "~/components/ui/container";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

const catalogItems = [
    {
        name: "Round Brilliant Cut",
        image: "/images/diamonds/round-brilliant-cut.png",
        price: "Starting from $1,000",
    },
    {
        name: "Princess Cut",
        image: "/images/diamonds/princess-cut.png",
        price: "Starting from $1,200",
    },
    {
        name: "Oval Cut",
        image: "/images/diamonds/oval-cut.png",
        price: "Starting from $1,100",
    },
    {
        name: "Emerald Cut",
        image: "/images/diamonds/emerald-cut.png",
        price: "Starting from $1,300",
    },
    {
        name: "Cushion Cut",
        image: "/images/diamonds/cushion-cut.png",
        price: "Starting from $1,150",
    },
    {
        name: "Pear Cut",
        image: "/images/diamonds/pear-cut.png",
        price: "Starting from $1,250",
    },
    {
        name: "Marquise Cut",
        image: "/images/diamonds/marquise-cut.png",
        price: "Starting from $1,200",
    },
    {
        name: "Radiant Cut",
        image: "/images/diamonds/radiant-cut.png",
        price: "Starting from $1,350",
    },
];

const CatalogPage = () => {
    return (
        <div className="py-20 w-full">
            <Container>
                <h1 className="text-4xl font-bold mb-12 text-center">
                    Our <span className="text-primary">Diamond Catalog</span>
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {catalogItems.map((item, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded overflow-hidden"
                        >
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={300}
                                height={300}
                                className="w-full object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-6">
                                    {item.name}
                                </h3>
                                {/*<p className="text-gray-600 mb-4">*/}
                                {/*    {item.price}*/}
                                {/*</p>*/}
                                <a
                                    href={`mailto:sales@ashleshajewells.com?subject=Product%20Inquiry&body=Dear%20Ashlesha%20Jewells,%0D%0A%0D%0AI%20would%20like%20to%20inquire%20about%20your%20products.%0D%0A%0D%0AProduct Name:%20${item.name || "Product-Name"}%0D%0AQuantity Needed:%20[Enter%20Your%20Quantity]%0D%0A%0D%0AThank%20you,%0D%0A%0D%0AYour%20Name%0D%0AYour%20Company`}
                                    className={cn(
                                        buttonVariants({ variant: "default" }),
                                        "w-full bg-primary hover:bg-primary/90 rounded-none",
                                    )}
                                >
                                    Request Quote
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};
export default CatalogPage;
