export type Product = {
    ID: number;
    name: string;
    slug: string;
    price: number;
    sku: string;
    stock: number;
    description: string;
    isLimitedEdition: boolean;
    material: string;
    weight: string;
    dimensions: string;
    categoryID?: number;
    tags: string;
    customFeatures: CustomFeatures;
    images: {
        ID: number;
        CreatedAt: string;
        UpdatedAt: string;
        DeletedAt: string | null;
        productID: number;
        name: string;
        src: string;
        alt: string;
    }[];
};

type CustomFeatures = {
    [key: string]: string;
};
