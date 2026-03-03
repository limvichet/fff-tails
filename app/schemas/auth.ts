import z from "zod";

export const schema = z.object({
  email: z
    .string()
    .nonempty("Please enter your email!")
    .email("Please enter a valid email!"),
  password: z.string().nonempty("Please enter your password!"),
});

export type LoginREQ = z.infer<typeof schema>;



