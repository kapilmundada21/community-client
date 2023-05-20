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
import { signupSchema } from "@/validationSchema";

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

export default function Signup() {
  // eslint-disable-next-line
  const [user, setUser] = useState(null);
  const [gAuthUser, setGAuthUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      router.push("/")
    }
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      const data = {
        name: values.firstName + " " + values.lastName,
        email: values.email,
        password: values.password
      }
      let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/signup`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': ' application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()
      if (response.success) {
        if (response.status === "Pending") {
          router.push(`/user/${response.id}`)
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
  })

  const handleCallbackResponse = (response) => {
    let userObject = jwt_decode(response.credential);
    setGAuthUser(userObject);

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
  // }, [gAuthUser]);

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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="First Name"
                  autoFocus
                />
                {errors.firstName && touched.firstName ? (<p className="text-red-600 text-sm">{errors.firstName}</p>) : null}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
                {errors.lastName && touched.lastName ? (<p className="text-red-600 text-sm">{errors.lastName}</p>) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
                {errors.email && touched.email ? (<p className="text-red-600 text-sm">{errors.email}</p>) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                {errors.password && touched.password ? (<p className="text-red-600 text-sm">{errors.password}</p>) : null}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2 !important' }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" className="text-blue-400" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>

            {/* <div className="my-6 flex items-center">
              <div className="flex-grow bg bg-gray-300 h-0.5"></div>
              <div className="flex-grow-0 mx-5">or continue with Google</div>
              <div className="flex-grow bg bg-gray-300 h-0.5"></div>
            </div> */}

            <center>
              <div id="googleAuthDiv" className="w-[80vw] md:w-[20vw]"></div>
            </center>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
