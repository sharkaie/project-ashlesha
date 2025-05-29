import { Container } from "~/components/ui/container";
import { Diamond } from "lucide-react";
import { Link } from "@remix-run/react";

const navigation = {
    main: [
        { name: "About", href: "/about-us" },
        { name: "Catalog", href: "/catalog" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact-us" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-neutral-950 text-white">
            <Container>
                <div className="py-12 md:flex md:items-center md:justify-between">
                    {/*<div className="flex justify-center space-x-6 md:order-2">*/}
                    {/*    {navigation.social.map(({ name, href, icon: Icon }) => (*/}
                    {/*        <a*/}
                    {/*            key={name}*/}
                    {/*            href={href}*/}
                    {/*            className="text-luxury-300 hover:text-luxury-100"*/}
                    {/*            aria-label={name}*/}
                    {/*        >*/}
                    {/*            <Icon className="h-6 w-6" aria-hidden="true" />*/}
                    {/*        </a>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                    <div className="mt-8 md:mt-0 md:order-1">
                        <Link
                            to="/"
                            className="flex items-center justify-center md:justify-start"
                        >
                            <Diamond className="h-8 w-8 text-luxury-500" />
                            <span className="ml-3 text-xl font-bold uppercase text-white">
                                Ashlesha Jewells
                            </span>
                        </Link>
                        <p className="mt-2 text-center md:text-left text-base text-luxury-300">
                            &copy; {new Date().getFullYear()} Ashlesha Jewells.
                            All rights reserved.
                        </p>
                    </div>
                </div>
                <div className="border-t border-luxury-700 py-8">
                    <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
                        {navigation.main.map(({ name, href }) => (
                            <div key={name} className="px-5 py-2">
                                <Link
                                    to={href}
                                    className="text-base text-luxury-300 hover:text-luxury-100"
                                >
                                    {name}
                                </Link>
                            </div>
                        ))}
                    </nav>
                </div>
            </Container>
        </footer>
    );
}
