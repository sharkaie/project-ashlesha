import { useLoaderData, useNavigate } from "@remix-run/react";
import { json, type LoaderFunction, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"; // ShadCN Input component
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Product } from "~/types/product";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "~/api/cart-api";
import { getSession } from "~/session.server";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import axios from "axios";
import { Badge } from "~/components/ui/badge";

// Loader to fetch product data from the API
export const loader: LoaderFunction = async ({ request, params }) => {
    const slug = params.slug;
    if (slug === undefined) {
        throw new Error("Product slug is required");
    }
    const apiUrl = `https://api.ashleshajewells.com/api/products/${params.slug}`;
    const response = await axios.get(apiUrl);
    console.log(response.data);

    const session = await getSession(request.headers.get("Cookie"));
    const sessionId = session.get("__sid");

    if (response.status !== 200) {
        throw new Response("Product not found", { status: response.status });
    }

    const product = await response.data;

    const normalizedProduct: Product = {
        ID: product.ID,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        isLimitedEdition: product.isLimitedEdition,
        customFeatures: product.customFeatures,
        material: product.material,
        weight: product.weight,
        dimensions: product.dimensions,
        sku: product.sku,
        tags: product.tags,
        images: product.images.length
            ? product.images.map((img: { src: string; alt: string }) => ({
                  id: Math.random().toString(36).substr(2, 9),
                  src: img.src,
                  alt: img.alt || "Product image",
              }))
            : [
                  {
                      id: "default",
                      src: "https://placehold.co/600x400",
                      alt: "Placeholder image",
                  },
              ],
    };

    return json({ sessionId, product: normalizedProduct });
};

// Meta Function
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const { product } = data as { product: Product };
    return [
        { title: `${product.name} | Ashlesha Jewells` },
        { name: "description", content: product.description },
    ];
};

// Product Page Component
export default function ProductPage() {
    const { product, sessionId } = useLoaderData<{
        product: Product;
        sessionId: string;
    }>();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [selectedRingSize, setSelectedRingSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    const ringSizes = [
        { size: "3", diameter: "14.0 mm" },
        { size: "3.5", diameter: "14.4 mm" },
        { size: "4", diameter: "14.8 mm" },
        { size: "4.5", diameter: "15.2 mm" },
        { size: "5", diameter: "15.6 mm" },
        { size: "5.5", diameter: "16.0 mm" },
        { size: "6", diameter: "16.45 mm" },
        { size: "6.5", diameter: "16.9 mm" },
        { size: "7", diameter: "17.3 mm" },
        { size: "7.5", diameter: "17.7 mm" },
        { size: "8", diameter: "18.2 mm" },
        { size: "8.5", diameter: "18.6 mm" },
        { size: "9", diameter: "19.0 mm" },
        { size: "9.5", diameter: "19.4 mm" },
        { size: "10", diameter: "19.8 mm" },
        { size: "10.5", diameter: "20.2 mm" },
        { size: "11", diameter: "20.6 mm" },
        { size: "11.5", diameter: "21.0 mm" },
        { size: "12", diameter: "21.4 mm" },
        { size: "12.5", diameter: "21.8 mm" },
        { size: "13", diameter: "22.2 mm" },
        { size: "13.5", diameter: "22.5 mm" },
    ];

    const queryClient = useQueryClient();
    // remove item from cart
    const addItemToCart = useMutation({
        mutationFn: async () => {
            if (!selectedRingSize) {
                throw new Error("Please select a ring size");
            }
            await addToCart({
                productID: product.ID,
                quantity,
                sessionID: sessionId,
                ringSize: selectedRingSize,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] }).then(() => {
                toast.success(`${product.name} added to cart!`);
                window.location.href = "/cart";
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleBuyNow = () => {
        if (!selectedRingSize) {
            toast.error("Please select a ring size");
            return;
        }
        // Add item to cart
        addItemToCart.mutate();
        navigate(`/checkout`);
    };

    return (
        <div className="bg-white">
            <div className="max-w-4xl mx-auto py-8 px-6 sm:py-16 sm:px-8 lg:max-w-7xl lg:px-12">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/"
                                className="text-gray-500 hover:text-gray-800"
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/#our-collection"
                                className="text-gray-500 hover:text-gray-800"
                            >
                                Collections
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-bold text-gray-800">
                                {product.name}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Image Gallery */}
                    <div className="flex flex-col">
                        <div className="w-full aspect-square mb-6">
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                loading="lazy"
                                className="w-full h-full object-center object-cover rounded-md shadow-lg"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={image.ID + "-image-thumb" + index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`w-full aspect-square rounded-md overflow-hidden ${
                                        image.src === selectedImage.src
                                            ? "ring-2 ring-gray-800"
                                            : ""
                                    }`}
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        loading="lazy"
                                        className="w-full h-full object-center object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 lg:mt-0">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>
                        {product.isLimitedEdition && (
                            <span className="text-sm font-semibold text-red-600 uppercase">
                                Limited Edition
                            </span>
                        )}

                        <p className="text-xl text-gray-700 mt-4">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="mt-6">
                            <Badge variant="secondary" className="text-red-400">
                                30% Off
                            </Badge>
                            <p className="text-3xl font-bold text-gray-900">
                                ${product.price.toLocaleString()}
                                <span className="text-sm font-medium text-gray-500 line-through ml-2">
                                    $
                                    {Math.round(
                                        product.price / 0.7,
                                    ).toLocaleString()}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Inclusive of all taxes
                            </p>
                        </div>

                        {/* Quantity, Add to Cart, and Buy Now */}
                        <div className="mt-8">
                            <div className="flex items-center space-x-4 md:space-x-6">
                                <div>
                                    <label
                                        htmlFor="quantity"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Quantity
                                    </label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                Number(e.target.value) < 0
                                                    ? 1
                                                    : Number(e.target.value),
                                            )
                                        }
                                        min={1}
                                        max={10}
                                        className="w-14 rounded-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="ringSize"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Ring Size
                                    </label>
                                    <Select
                                        onValueChange={(value) =>
                                            setSelectedRingSize(value)
                                        }
                                    >
                                        <SelectTrigger className="w-[180px] rounded-none">
                                            <SelectValue placeholder="Select a Ring Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ringSizes.map((size) => (
                                                <SelectItem
                                                    className="cursor-pointer"
                                                    key={size.size}
                                                    value={size.size}
                                                >
                                                    {size.size} -{" "}
                                                    {size.diameter}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-6">
                                {/* Add to Cart */}
                                <Button
                                    variant={"outline"}
                                    onClick={() => addItemToCart.mutate()}
                                    className={
                                        "px-6 py-3  font-medium text-gray-900 border border-gray-400 hover:bg-gray-100 rounded-none"
                                    }
                                >
                                    Add to Cart
                                </Button>

                                {/* Buy Now */}
                                <Button
                                    variant={"default"}
                                    className={
                                        "px-6 py-3  font-medium uppercase bg-black text-white hover:bg-gray-800 transition rounded-none"
                                    }
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Product Features
                            </h2>
                            <table className="w-full border-t border-gray-200">
                                <tbody>
                                    {Object.entries(product.customFeatures).map(
                                        ([key, value]) => (
                                            <tr key={key} className="border-b">
                                                <th className="py-3 text-left text-sm font-medium text-gray-700 capitalize">
                                                    {key}
                                                </th>
                                                <td className="py-3 text-sm text-gray-900">
                                                    {value}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
