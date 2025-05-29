import { Link } from "@remix-run/react";
import { Diamond } from "lucide-react";
import { Container } from "~/components/ui/container";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about-us" },
    { name: "Catalog", href: "/catalog" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact-us" },
];

const Header = () => {
    return (
        <header className="bg-white border-b-2 border-luxury-300">
            <Container>
                <div className="flex items-center justify-between py-6">
                    <Link to="/" className="flex items-center space-x-2">
                        <Diamond className="h-5 w-5 md:h-8 md:w-8 text-luxury-500" />
                        <span className="text-lg md:text-xl font-bold uppercase text-secondary-foreground">
                            Ashlesha Jewells
                        </span>
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-secondary-foreground hover:text-luxury-500 transition-colors font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <a
                        href={`
                        mailto:sales@ashleshajewells.com?subject=Product%20Inquiry&body=Dear%20Support,%0D%0A%0D%0AI%20would%20like%20to%20inquire%20about%20your%20products.%0D%0A%0D%0AProduct Name:%20[Product]%0D%0AQuantity Needed:%20[X]%0D%0A%0D%0AThank%20you,%0D%0A%0D%0AYour%20Name%0D%0AYour%20Company`}
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "bg-luxury-500 hover:bg-luxury-600 text-white font-semibold rounded-none",
                        )}
                    >
                        Request a Quote
                    </a>
                </div>
            </Container>
        </header>
    );
};
export default Header;
