import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
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
import jwt_decode from "jwt-decode";
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
            <Link color="inherit" href="https://weoto.in/">
                Weoto Technologies Private Limited
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {
    // eslint-disable-next-line
    const [gAuthUser, setGAuthUser] = useState(null);
    // eslint-disable-next-line
    const [user, setUser] = useState(null); 
    const router = useRouter();

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"));
        if(user && user.token){
            router.push("/")
        }
    });

    const handelGAuth = (userObject) => {

    };

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
            }
            let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': ' application/json',
                },
                body: JSON.stringify(data),
            })
            let response = await res.json()
            if (response.success) {
                localStorage.setItem('user', JSON.stringify({ token: response.token, name: response.user.name, email: response.user.email, id: response.user.id }))
                router.push("/news")
            }
            else {
                if(response.status === "Pending"){
                    router.push(`/user/${response.id}`)
                }
                else{
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
        }
    })

    const handleCallbackResponse = (response) => {
        let userObject = jwt_decode(response.credential);
        setGAuthUser(userObject);
        handelGAuth(userObject);
    };

    // useEffect(() => {
    //   // / * global google */
    //   //eslint-disable-next-line
    //   google.accounts.id.initialize({
    //     client_id: {process.env.GAUTH_CLIENT_ID},
    //     callback: handleCallbackResponse,
    //   });

    //   //eslint-disable-next-line
    //   google.accounts.id.renderButton(document.getElementById("googleAuthDiv"), {
    //     theme: "outline",
    //     size: "large",
    //   });

    //   //eslint-disable-next-line
    //   google.accounts.id.prompt();

    //   //eslint-disable-next-line
    // }, [values.loginType]);

    return (
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

                {/* <div className="my-6 flex items-center">
          <div className="flex-grow bg bg-gray-300 h-0.5"></div>
          <div className="flex-grow-0 mx-5">or continue with Google</div>
          <div className="flex-grow bg bg-gray-300 h-0.5"></div>
        </div> */}

                <center>
                    <div id="googleAuthDiv" className="w-[80vw] md:w-[20vw]"></div>
                </center>

                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
