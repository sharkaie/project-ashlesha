const Footer = () => {
    return (
        <footer className="bg-neutral-950 text-white py-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center gap-6">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold uppercase">
                            Ashlesha Jewells
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-2 text-sm text-gray-400">
                        <p>
                            © {new Date().getFullYear()} Ashlesha Jewells. All
                            Rights Reserved.
                        </p>
                        <p>
                            <a
                                href="/terms"
                                className="hover:text-white transition"
                            >
                                Terms & Conditions
                            </a>{" "}
                            |{" "}
                            <a
                                href="/privacy"
                                className="hover:text-white transition"
                            >
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-6"></div>

                {/* Contact & Social Section */}
                <div className="flex flex-wrap justify-between items-center gap-6">
                    <div className="text-sm text-gray-400">
                        <p>Contact Us: info@ashleshajewells.com</p>
                        {/*<p>Phone: +919623630493</p>*/}
                    </div>
                    <div className="flex space-x-6">
                        <a
                            href="https://www.facebook.com/profile.php?id=61567699724344&ref=xav_ig_profile_web"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="hover:text-white transition"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://www.instagram.com/ashleshajewells/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:text-white transition"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
