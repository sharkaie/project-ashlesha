import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const FormSchema = z.object({
    email: z.string().email({
        message: "Email is invalid",
    }),
});

const Newsletter = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //   <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        // </pre>
        //     ),
        // })
        form.reset();

        console.log(data);
    }

    return (
        <section className="flex-1 bg-neutral-100 w-full py-12">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl text-center">
                        Subscribe Newsletter
                    </h2>
                    <p className="text-center text-gray-600">
                        Sing up to our Newsletter and get notified about new
                        products.
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col items-center md:items-start md:flex-row gap-4 mt-8 "
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <>
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="w-72 text-center md:w-96 px-4 py-5 rounded-none border border-neutral-300 focus:text-base md:text-base placeholder:text-base"
                                                    placeholder="Enter your email address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                            <Button
                                type="submit"
                                className="py-5 rounded-none uppercase"
                                variant={"default"}
                            >
                                Subscribe
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    );
};
export default Newsletter;
