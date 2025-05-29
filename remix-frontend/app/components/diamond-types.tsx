import { Container } from "~/components/ui/container";

const diamondTypes = [
    {
        name: "Natural Diamonds",
        image: "/images/diamonds/natural-diamonds.webp",
        description: "Earth-mined, rare, and unique",
    },
    {
        name: "Lab-Grown Diamonds",
        image: "/images/diamonds/lab-grown-diamonds.webp",
        description: "Ethically created, identical properties",
    },
    {
        name: "Colored Diamonds",
        image: "/images/diamonds/coloured-diamonds-2.webp",
        description: "Rare and vibrant natural hues",
    },
    {
        name: "Fancy Cuts",
        image: "/images/diamonds/fancy-cuts-diamonds.webp",
        description: "Unique shapes for distinct designs",
    },
];

const DiamondTypes = () => {
    return (
        <section className="py-24 bg-white">
            <Container>
                <h2 className="text-4xl font-serif font-bold text-center mb-16">
                    Our{" "}
                    <span className="text-luxury-500">Diamond Collections</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {diamondTypes.map((type, index) => (
                        <div key={index} className="group">
                            <div className="relative overflow-hidden mb-6">
                                <img
                                    src={type.image || "/placeholder.svg"}
                                    alt={type.name}
                                    width={300}
                                    height={300}
                                    className="w-full transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {type.name}
                            </h3>
                            <p className="text-secondary-foreground/70">
                                {type.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
export default DiamondTypes;
