import { MetaFunction } from "@remix-run/node";
import HeroSection from "~/components/hero-section";
import DiamondTypes from "~/components/diamond-types";
import CtaSection from "~/components/cta-section";
import SupplyProcess from "~/components/supply-process";
import B2BBenefits from "~/components/b2b-benefits";
import Testimonials from "~/components/testimonials";

export const meta: MetaFunction = () => {
    return [
        {
            title: "Ashlesha Jewells - Exquisite Diamonds for Timeless Elegance",
        },
        {
            name: "description",
            content:
                "Discover Ashlesha Jewells' exquisite collection of premium natural and lab-grown diamonds, crafted for timeless elegance and perfection. b2b diamonds, lab-grown diamonds, natural diamonds, diamond supply chain",
        },
        {
            property: "og:title",
            content:
                "Exquisite Diamonds for Timeless Elegance - Ashlesha Jewells",
        },
        {
            property: "og:description",
            content:
                "Discover Ashlesha Jewells' exquisite collection of premium natural and lab-grown diamonds, crafted for timeless elegance and perfection.",
        },
        {
            property: "og:image",
            content:
                "https://res.cloudinary.com/dsnud8jwh/image/upload/c_limit,h_630,w_1200/ashlesha-hero-img-d", // Updated for Valentine-themed image
        },
    ];
};

export default function Index() {
    return (
        <>
            <HeroSection />
            <DiamondTypes />
            <B2BBenefits />
            <SupplyProcess />
            <Testimonials />
            <CtaSection />
        </>
    );
}
