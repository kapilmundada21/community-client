import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import { resetPasswordSchema, sendRestEmailSchema } from '@/validationSchema';

const theme = createTheme();

export default function Resetpassword() {
    const router = useRouter()
    const token = router.query.token;

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"));
        if(user && user.token){
            router.push("/")
        }
    });

    const sendRestEmail = async () => {
        let data = {
            email: values.email,
            sendMail: true
        }
        let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/resetpassword`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify(data),
        })
        let response = await a.json()
        if (response.sucess) {
            let data = {
                to: values.email,
                token: response.token,
            }
            let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/sendgrid`, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': ' application/json',
                },
                body: JSON.stringify(data),
            })
            let res = await a.json()
            if(res.success){
                toast.success("Mail has been send sucessfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    router.push('/login')
                }, 1000);
            }
            else{
                toast.error("500: "+res.error, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        else {
            toast.error(response.error, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const resetPassword = async () => {
        const data = { 
            token, 
            password: values.password, 
            sendMail: false 
        }
        let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/resetpassword`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify(data),
        })
        let response = await a.json()

        if (response.sucess) {
            toast.success('Password has been changed Sucessfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                router.push('/login')
            }, 1000);
        }
        else {
            toast.error(response.error, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                router.push('/resetpassword')
            }, 1000);
        }
    }

    const initialValues = {
        email: "",
        password: "",
        cpassword: "",
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: token ? resetPasswordSchema : sendRestEmailSchema,
        onSubmit: (values) => {
            if (token) {
                resetPassword()
            }
            else {
                sendRestEmail()
            }
        }
    })

    return (
        <div>
            <ThemeProvider theme={theme}>
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
                            <Image src="/clogo.png" alt="logo" height={40} width={40} />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}
                        >

                            {
                                !token &&
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
                            }
                            {errors.email && touched.email ? (<p className="text-red-600 text-sm">{errors.email}</p>) : null}

                            {
                                token &&
                                <div>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="New Password"
                                        type="password"
                                        id="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.password && touched.password ? (<p className="text-red-600 text-sm">{errors.password}</p>) : null}
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="cpassword"
                                        label="Conform Password"
                                        type="password"
                                        id="cpassword"
                                        autoComplete="cpassword"
                                        value={values.cpassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.cpassword && touched.cpassword ? (<p className="text-red-600 text-sm">{errors.cpassword}</p>) : null}
                                </div>
                            }

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2 !important' }}
                            >
                                {token ? 'Reset Password' : 'Continue'}
                            </Button>
                            {
                                !token &&
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="/login" className="text-blue-400" variant="body2">
                                            Login
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signup" className="text-blue-400" variant="body2">
                                            Sign Up
                                        </Link>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    )
}