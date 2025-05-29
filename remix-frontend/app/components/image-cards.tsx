const ImageCards = () => {
    return (
        <section className="flex-1">
            <div className="container mx-auto px-4 gap-8 flex flex-col lg:flex-row">
                <div className="relative">
                    <div className="flex-1">
                        <img
                            className="w-full h-96 object-cover"
                            src="/images/banners/banner-1.webp"
                            alt="Banner 1"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute inset-0 flex justify-start items-start p-8 pt-16">
                        <div className="text-neutral-900 flex flex-col gap-3">
                            <h2 className="text-4xl">Secure Purchase</h2>
                            <p className="text-base text-accent-foreground">
                                Get your premium ring <br />
                                from anywhere
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="flex-1">
                        <img
                            className="w-full h-96 object-cover"
                            src="/images/banners/banner-2.webp"
                            alt="Banner 1"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute inset-0 flex justify-start items-start p-8 pt-16">
                        <div className="text-neutral-900 flex flex-col gap-3">
                            <h2 className="text-4xl">Luxury Collection</h2>
                            <p className="text-base text-accent-foreground">
                                Marked with excellent premium <br /> diamonds
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default ImageCards;
