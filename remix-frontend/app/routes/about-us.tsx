import { Container } from "~/components/ui/container";

const certificates = [
    { name: "GIA", description: "Gemological Institute of America" },
    { name: "IGI", description: "International Gemological Institute" },
    { name: "AGS", description: "American Gem Society" },
    { name: "HRD", description: "Hoge Raad voor Diamant" },
];

const AboutUsPage = () => {
    return (
        <div className={"py-24 w-full"}>
            <Container>
                <h1 className="text-5xl font-bold mb-12 text-center">
                    About Ashlesha Jewells
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <img
                            src="/images/diamonds/about-us.png"
                            alt="Ashlesha Jewells workshop"
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="space-y-6 text-lg">
                        <p>
                            Ashlesha Jewells is a premier provider of both
                            natural and lab-grown diamonds for the B2B jewelry
                            industry. Our commitment to quality, innovation, and
                            ethical practices sets us apart in the market.
                        </p>
                        <p>
                            Founded in [year], we have continuously pushed the
                            boundaries of diamond technology and sourcing to
                            deliver exceptional products to our partners. Our
                            state-of-the-art facilities and expert team ensure
                            that every diamond we offer meets the highest
                            standards of quality and brilliance.
                        </p>
                        <p>
                            At Ashlesha Jewells, we believe in the power of
                            choice. Our diverse selection of both natural and
                            lab-grown diamonds allows our B2B partners to cater
                            to a wide range of customer preferences and ethical
                            considerations.
                        </p>
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-8 text-center">
                    Our Certifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                    {certificates.map((cert, index) => (
                        <div
                            key={index}
                            className="text-center p-6 border border-luxury-200 rounded-lg"
                        >
                            <h3 className="text-xl font-bold mb-2 text-luxury-500">
                                {cert.name}
                            </h3>
                            <p className="text-secondary-foreground/70">
                                {cert.description}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-8">
                        Our Commitment to Excellence
                    </h2>
                    <p className="text-lg max-w-3xl mx-auto">
                        At Ashlesha Jewells, we are dedicated to providing our
                        B2B partners with the finest diamonds and unparalleled
                        service. Our commitment to ethical sourcing,
                        cutting-edge technology, and expert craftsmanship
                        ensures that every diamond we offer is of the highest
                        quality and value.
                    </p>
                </div>
            </Container>
        </div>
    );
};
export default AboutUsPage;
