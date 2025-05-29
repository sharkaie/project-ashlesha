import { Link } from "@remix-run/react";

const Navbar = () => {
    return (
        <header className="relative z-[100] w-full">
            <div className="transition duration-500 flex flex-nowrap justify-center h-20 bg-neutral-950 text-white">
                <div className="container">
                    <div className="flex justify-center items-center h-full">
                        <Link to="/">
                            <span className="uppercase font-normal text-2xl">
                                Ashlesha Jewells
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="border-b hidden md:block">
                <div className="transition duration-500 flex flex-nowrap justify-center h-12">
                    <div className="container">
                        <div className="flex justify-between h-full">
                            <nav className="flex flex-1 justify-start items-center gap-10 px-10">
                                <Link
                                    className="font-semibold uppercase text-sm"
                                    to="/"
                                >
                                    Home
                                </Link>
                                <Link
                                    className="font-semibold uppercase text-sm"
                                    to="/#our-collection"
                                >
                                    Supply-Chain
                                </Link>

                                <Link
                                    className="font-semibold uppercase text-sm"
                                    to="/#about"
                                >
                                    About Us
                                </Link>
                                <Link
                                    className="font-semibold uppercase text-sm"
                                    to="/#contact"
                                >
                                    Contact Us
                                </Link>
                            </nav>
                            <div className="font-semibold text-sm uppercase flex justify-end items-center w-1/4">
                                {/*<div className="flex justify-center items-center h-full pl-12 pr-8">*/}
                                {/*    <Link*/}
                                {/*        to={"/cart"}*/}
                                {/*        className={cn(*/}
                                {/*            buttonVariants({*/}
                                {/*                variant: "link",*/}
                                {/*                size: "sm",*/}
                                {/*            }),*/}
                                {/*        )}*/}
                                {/*    >*/}
                                {/*        <ShoppingCartIcon className="w-5 h-5 stroke-2" />*/}
                                {/*    </Link>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
