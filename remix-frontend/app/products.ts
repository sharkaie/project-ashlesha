import { Product } from "~/types/product";

const products: Product[] = [
    {
        id: "1",
        name: "Luxe Aura",
        slug: "luxe-aura",
        images: [
            {
                id: 1,
                name: "Front view",
                src: "/images/products/luxe-aura/luxe-aura.webp",
                alt: "Front view of Luxe Aura ring with sapphire centerpiece.",
            },
            {
                id: 2,
                name: "Side view",
                src: "/images/products/luxe-aura/luxe-aura-7.webp",
                alt: "Side view of Luxe Aura ring showcasing craftsmanship.",
            },
        ],
        description:
            "The Luxe Aura by Ashlesha Jewells is a premium, limited-edition sapphire ring designed for those who appreciate unmatched craftsmanship and exclusivity.",
        features: {
            centerpiece: "1.00-carat oval sapphire",
            sideStones: "Six side sapphires (0.20 carats each)",
            material: "18-karat white gold",
            weight: "5 grams",
        },
        usage: "Perfect for engagements, anniversaries, or as a treasured heirloom.",
        isLimitedEdition: true,
    },
    {
        id: "2",
        name: "Starlit Crown",
        slug: "starlit-crown",
        images: [
            {
                id: 1,
                name: "Angled view",
                src: "/images/products/starlit-crown/starlit-crown-1.webp",
                alt: "Angled view of Starlit Crown ring.",
            },
            {
                id: 2,
                name: "Detail view",
                src: "/images/products/starlit-crown/starlit-crown-2.webp",
                alt: "Detail view showcasing Starlit Crown’s diamond arrangement.",
            },
        ],
        description:
            "The Starlit Crown is a breathtaking fusion of luxury and sophistication, featuring a stunning 1.00-carat sapphire at its heart.",
        features: {
            centerpiece: "1.00-carat sapphire",
            sideStones:
                "16 dazzling diamonds, 8 on each side, plus 26 additional diamonds (total weight 0.90 carats)",
            material: "18kt white gold",
            weight: "4 grams",
        },
        usage: "Perfect for celebrating extraordinary moments.",
        isLimitedEdition: true,
    },
    {
        id: "3",
        name: "Saphire Blossom",
        slug: "saphire-blossom",
        images: [
            {
                id: 1,
                name: "Top view",
                src: "/images/products/saphire-blossom/saphire-blossom-1.webp",
                alt: "Top view of Saphire Blossom with floral design.",
            },
            {
                id: 2,
                name: "Close-up",
                src: "/images/products/saphire-blossom/saphire-blossom-2.webp",
                alt: "Close-up of Saphire Blossom highlighting diamond details.",
            },
        ],
        description:
            "The Saphire Blossom combines luxury, elegance, and impeccable craftsmanship with a captivating flower-inspired design.",
        features: {
            centerpiece: "1.00-carat diamond",
            petals: "16 smaller diamonds (0.60 carats in total)",
            material: "18kt white gold",
            weight: "4 grams",
        },
        usage: "Ideal for engagements, anniversaries, or milestone occasions.",
        isLimitedEdition: true,
    },
    {
        id: "4",
        name: "Radiant Summit",
        slug: "radiant-summit",
        images: [
            {
                id: 1,
                name: "Elegant view",
                src: "/images/products/radiant-summit/radiant-summit-1.webp",
                alt: "Elegant view of Radiant Summit diamond ring.",
            },
            {
                id: 2,
                name: "Side detail",
                src: "/images/products/radiant-summit/radiant-summit-2.webp",
                alt: "Side detail of Radiant Summit showing smaller diamonds.",
            },
        ],
        description:
            "The Radiant Summit embodies refined luxury and elegant simplicity with a breathtaking 1.00-carat diamond centerpiece.",
        features: {
            centerpiece: "1.00-carat diamond",
            sideStones: "16 smaller diamonds (total weight 0.50 carats)",
            material: "18kt white gold",
            weight: "4 grams",
        },
        usage: "Perfect for engagements, anniversaries, or as a statement piece.",
        isLimitedEdition: true,
    },
    {
        id: "5",
        name: "Golden Summit",
        slug: "golden-summit",
        images: [
            {
                id: 1,
                name: "Front view",
                src: "/images/products/golden-summit/golden-summit-1.webp",
                alt: "Front view of Golden Summit ring in yellow gold.",
            },
            {
                id: 2,
                name: "Detailed view",
                src: "/images/products/golden-summit/golden-summit-2.webp",
                alt: "Detailed view of Golden Summit showcasing diamond arrangement.",
            },
        ],
        description:
            "The Golden Summit combines luxury with timeless elegance, featuring a unique design in 18kt yellow gold.",
        features: {
            centerpiece: "1.00-carat diamond",
            sideStones: "16 smaller diamonds (total weight 0.50 carats)",
            material: "18kt yellow gold",
            weight: "4 grams",
        },
        usage: "Ideal for engagements, anniversaries, or as a special indulgence.",
        isLimitedEdition: true,
    },
];

export default products;
