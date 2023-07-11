import Head from 'next/head';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router'
import axios from 'axios';
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
import { Autocomplete, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

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

// const cityOptions = [
//   'Nashik',
//   'Dhule',
//   'Jalgaon'
// ];

export default function Signup() {
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
    gender: "Male",
    city: "",
    state: "",
    password: "",
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      const data = {
        name: values.firstName + ' ' + values.lastName,
        email: values.email,
        gender: values.gender,
        city: values.city,
        state: values.state,
        password: values.password,
      };
      try {
        const response = await axios.post(`/api/user/post`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data.success && response.data.status === 'Pending') {
          router.push(`/user/profile/${response.data.id}`);
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
        <title>{`Signup | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
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
                  required
                  fullWidth
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="given-name"
                  autoFocus
                />
                {errors.firstName && touched.firstName ? (<p className="text-red-600 text-sm">{errors.firstName}</p>) : null}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="family-name"
                />
                {errors.lastName && touched.lastName ? (<p className="text-red-600 text-sm">{errors.lastName}</p>) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
                {errors.email && touched.email ? (<p className="text-red-600 text-sm">{errors.email}</p>) : null}
              </Grid>
              <Grid item xs={12}>
                <FormControl className="space-x-4">
                  <Typography variant='subtitle1'>Gender</Typography>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    id="gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    <FormControlLabel value="Third" control={<Radio />} label="Third" />
                  </RadioGroup>
                </FormControl>
                {errors.gender && touched.gender ? (<p className="text-red-600 text-sm">{errors.gender}</p>) : null}
              </Grid>
              <Grid item xs={12}>
                {/* <Autocomplete
                  disablePortal
                  freeSolo
                  options={cityOptions}
                  renderInput={(params) =>
                    <TextField {...params}
                      id="city"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="City"
                    />}
                /> */}
                <TextField
                  required
                  fullWidth
                  label="City"
                  id="city"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.city && touched.city ? (<p className="text-red-600 text-sm">{errors.city}</p>) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  id="state"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.state && touched.state ? (<p className="text-red-600 text-sm">{errors.state}</p>) : null}
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
          </Box>
        </Box>
        <Copyright sx={{ my: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
