import { Container } from "~/components/ui/container";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

const ContactUsPage = () => {
    return (
        <div className="py-20 w-full">
            <Container>
                <h1 className="text-4xl font-bold mb-12 text-center">
                    Contact{" "}
                    <span className="text-primary">Ashlesha Jewells</span>
                </h1>
                <div className="max-w-2xl mx-auto">
                    <form className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 rounded-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 rounded-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="company"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Company
                            </label>
                            <Input
                                id="company"
                                name="company"
                                type="text"
                                className="mt-1 rounded-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Message
                            </label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={4}
                                required
                                className="mt-1 rounded-none"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </Container>
        </div>
    );
};
export default ContactUsPage;
