import { z } from "zod";

const formSchema = z.object({
    firstName: z.string().min(1, "Full Legal Name is required."),
    lastName: z.string().min(1, "Full Legal Name is required."),
    dateOfBirth: z.string().min(1, "Date of Birth is required."),
    phone: z
        .string()
        .regex(
            /^\d{10,15}$/,
            "Mobile Number must be between 10 and 15 digits.",
        ),
    email: z.string().email("Invalid email address."),
    shippingAddress: z.object({
        streetAddress: z.string().min(1, "Street Address is required."),
        city: z.string().min(1, "City is required."),
        state: z.string().min(1, "State/Province is required."),
        postalCode: z
            .string()
            .regex(
                /^(?:[a-zA-Z0-9]{4,10}|[a-zA-Z0-9 ]{4,})$/,
                "Postal Code must be between 4 and 10 characters.",
            ),
        country: z.string().min(1, "Country is required."),
    }),
    billingAddress: z.object({
        streetAddress: z.string().min(1, "Street Address is required."),
        city: z.string().min(1, "City is required."),
        state: z.string().min(1, "State/Province is required."),
        postalCode: z
            .string()
            .regex(
                /^(?:[a-zA-Z0-9]{4,10}|[a-zA-Z0-9 ]{4,})$/,
                "Postal Code must be between 4 and 10 characters.",
            ),
        country: z.string().min(1, "Country is required."),
    }),
    notes: z
        .string()
        .max(500, "Notes cannot exceed 500 characters.")
        .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export { formSchema as CheckoutFormSchema };
export type { FormValues as CheckoutFormValues };
