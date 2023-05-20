import * as Yup from "yup";

const emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.+([a-zA-Z0-9-])/

export const resetPasswordSchema = Yup.object({
    password: Yup.string().min(4).max(25).required("please enter your password"),
    cpassword: Yup.string().required("please enter your password").oneOf([Yup.ref("password"), null ], "Password must match" ),
});

export const sendRestEmailSchema = Yup.object({
    email: Yup.string().matches(emailValidation, 'must match abc@company.com').required("please enter your email"),
});

export const loginSchema = Yup.object({
    email: Yup.string().matches(emailValidation, 'must match abc@company.com').required("please enter your email"),
    password: Yup.string().min(4).max(25).required("please enter your password"),
});

export const signupSchema = Yup.object({
    firstName: Yup.string().min(2).max(25).required("please enter your first name"),
    lastName: Yup.string().min(2).max(25).required("please enter your last name"),
    email: Yup.string().matches(emailValidation, 'must match abc@company.com').required("please enter your email"),
    password: Yup.string().min(4).max(25).required("please enter your password"),
});

export const userSchema = Yup.object({
    name: Yup.string().min(4).max(50).required("please enter your name"),
    email: Yup.string().matches(emailValidation, 'must match abc@company.com').required("please enter your email"),
});

export const uploadNewsSchema = Yup.object({
    title: Yup.string().min(2).max(250).required("please enter news title"),
    description: Yup.string().min(250).required("please enter news description"),
    img: Yup.string().min(2).required("please enter image url"),
    publishedBy: Yup.string().min(2).required("please enter news publisher name"),
});