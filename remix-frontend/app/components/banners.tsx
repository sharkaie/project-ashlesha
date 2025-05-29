const Banners = () => {
    return (
        <section className="flex-1">
            <div className="container mx-auto px-4 gap-8 flex flex-col lg:flex-row ">
                <div className="relative">
                    <div className="flex-1">
                        <img
                            className="w-full h-64 md:h-80 object-cover"
                            src="/images/banners/banner-3.webp"
                            alt="Banner 1"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute inset-0 flex justify-start items-start p-8 pt-16">
                        <div className="text-white flex flex-col gap-3">
                            <p className="text-sm">GOLD JEWELLERY</p>
                            <h2 className="text-4xl">Pure Gold Collection</h2>
                            <p className="text-lg">
                                24K Gold Jewellery Collection
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="flex-1">
                        <img
                            className="w-full h-64 md:h-80 object-cover"
                            src="/images/banners/banner-4.webp"
                            alt="Banner"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute inset-0 flex justify-start items-start p-8 pt-16">
                        <div className="text-white flex flex-col gap-3">
                            <p className="text-sm">ELEGANT JEWELLERY</p>
                            <h2 className="text-4xl">Special Craftsmanship</h2>
                            <p className="text-lg">Highly carved jewellery</p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="flex-1">
                        <img
                            className="w-full h-64 md:h-80 object-cover"
                            src="/images/banners/banner-5.webp"
                            alt="Banner"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute inset-0 flex justify-start items-start p-8 pt-16">
                        <div className="text-white flex flex-col gap-3">
                            <p className="text-sm">PREMIUM JEWELLERY</p>
                            <h2 className="text-4xl">Exclusive Collection</h2>
                            <p className="text-lg">
                                Discover our premium collection
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Banners;
