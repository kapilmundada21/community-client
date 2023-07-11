import Head from 'next/head';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router'
import axios from 'axios';
import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from 'formik';
import { loginSchema } from "@/validationSchema";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="">
                {process.env.NEXT_PUBLIC_WEBSITE_NAME}
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            router.push("/")
        }
    // eslint-disable-next-line
    }, []);

    const initialValues = {
        email: "",
        password: "",
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            const data = {
                email: values.email,
                password: values.password,
            };
            try {
                const response = await axios.post(`/api/auth/login`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.success) {
                    if (response.data.user.status !== 'Approved') {
                        router.push(`/user/profile/${response.data.user._id}`);
                    } else {
                        localStorage.setItem(
                            'user',
                            JSON.stringify({
                                token: response.data.token,
                                name: response.data.user.name,
                                id: response.data.user._id,
                            })
                        );
                        router.push('/news');
                    }
                } else {
                    toast.error(response.data.error, {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>{`Login | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
            </Head>
            
            <Container component="main" maxWidth="xs">
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <Image src="/images/clogo.png" alt="logo" height={40} width={40} loading="lazy" />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.email && touched.email ? (<p className="text-red-600 text-sm">{errors.email}</p>) : null}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.password && touched.password ? (<p className="text-red-600 text-sm">{errors.password}</p>) : null}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2 !important' }}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/resetpassword" className="text-blue-400" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" className="text-blue-400" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
