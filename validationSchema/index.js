import * as Yup from "yup";

const emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.+([a-zA-Z0-9-])/

export const resetPasswordSchema = Yup.object({
    password: Yup.string().min(4).max(25).required("please enter your password"),
    cpassword: Yup.string().required("please enter your password").oneOf([Yup.ref("password"), null], "Password must match"),
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
    gender: Yup.string().min(4).max(10).required("please select gender"),
    city: Yup.string().min(2).max(15).required("please select your city"),
    state: Yup.string().min(2).max(25).required("please select your state"),
    password: Yup.string().min(4).max(25).required("please enter your password"),
});

export const userSchema = Yup.object({
    name: Yup.string().min(4).max(50).required("please enter your name"),
    email: Yup.string().matches(emailValidation, 'must match abc@company.com').required("please enter your email"),
});

export const uploadNewsSchema = Yup.object().shape({
    title: Yup.string().min(2).max(250).required("please enter news title"),
    description: Yup.string().min(250).required("please enter news description"),
    img: Yup.string().min(2).required("please enter image url"),
    // files: Yup.array()
    //     .required('Please upload news image')
    //     .min(1, 'Please upload news image')
    //     .max(3, 'Max allowed images is 3')
    //     .test('fileFormats', 'Only JPEG, JPG, and PNG file formats are allowed', (value) => {
    //         if (!value) return true;

    //         const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

    //         return value.every((file) => allowedFormats.includes(file.type));
    //     })
    //     .test('fileSize', 'Max allowed image size is 256kb', (value) => {
    //         if (!value) return true;

    //         const maxFileSize = 256 * 1024; // 256kb

    //         return value.every((file) => file.size <= maxFileSize);
    //     }),
    publishedBy: Yup.string().min(2).required("please enter news publisher name"),
});
