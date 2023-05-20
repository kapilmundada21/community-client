import User from '../../models/user';
import mongoose from "mongoose";
import { useRouter } from 'next/router'
import Error from 'next/error'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useFormik } from 'formik';
import { Button, Typography } from "@mui/material";
import { userSchema } from '@/validationSchema';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Slug({ error, user }) {
    const router = useRouter();
    const { slug } = router.query;

    const initialValues = {
        name: user.name,
        email: user.email
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: userSchema,
        onSubmit: async (values) => {
            let data = {
                name: values.name,
                email: values.email,
            }
            let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user`, {
                method: 'PATCH', // or 'PUT'
                headers: {
                    'Content-Type': ' application/json',
                },
                body: JSON.stringify(data),
            })
            let response = await res.json()
            if (response.success) {
                toast.success('Sucessfully Re-applied!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                router.push(`/user/${response.id}`)
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

    if (error == 404) {
        return <Error statusCode={404} />
    }

    return (
        <div className=''>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 1, }}
            >
                <div className="m-4 md:my-8">
                    <div className="flex flex-col md:flex-row justify-between items-center m-1 p-2 md:px-8 rounded-lg font-bold">
                        <h3 className='text-2xl font-bold'>Account Details</h3>
                        <span className='bg-red-500 text-white px-2 md:py-1 rounded-md'>Status {user.status}</span>
                    </div>
                    <Grid
                        container
                        padding={3}
                        spacing={4}
                        columns={{ xs: 2, sm: 6, md: 12 }}
                    >
                        {
                            (user.status === "Pending") ?
                                <Grid item xs={2} sm={4} md={4}>
                                    <div className="mx-4 text-lg">
                                        <strong>Name :</strong> <span>{values.name}</span>
                                    </div>
                                </Grid> :
                                <Grid item xs={2} sm={6} md={6}>
                                    <TextField
                                        required
                                        id="name"
                                        label="Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        InputProps={{
                                            readOnly: (user.status === "Pending"),
                                        }}
                                    />
                                    {errors.name && touched.name ? (<p className="text-red-600 text-sm">{errors.name}</p>) : null}
                                </Grid>
                        }
                        {
                            (user.status === "Pending") ?
                                <Grid item xs={2} sm={4} md={4}>
                                    <div className="mx-4 text-lg">
                                        <strong>Email :</strong> <span>{values.email}</span>
                                    </div>
                                </Grid> :
                                <Grid item xs={2} sm={6} md={6}>
                                    <TextField
                                        required
                                        id="email"
                                        label="Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    {errors.email && touched.email ? (<p className="text-red-600 text-sm">{errors.email}</p>) : null}
                                </Grid>
                        }
                    </Grid>
                    <center>
                        {
                            !(user.status === "Pending") &&
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2 !important' }}
                            >
                                Save Changes and Reapply
                            </Button>
                        }
                    </center>

                    <div className="md:mx-8 md:mt-8 note">
                        <strong>Note:</strong>
                        <ul start="circle" className='md:ml-4'>
                            <li>Your account has been created sucessfully</li>
                            <li>You will get full access of website if your account status is Approved</li>
                            <li>You can update your account details after the application is {`"Accepted" or "Rejected"`} but not in {`"Pending`} state.</li>
                            <li>If account is Rejected then update your application according to requirements and reapply.</li>
                            <li>Till then Please wait for Approval and Stay connected with us. Thank you!</li>
                        </ul>
                    </div>
                </div>
            </Box>
        </div>
    )
}

export async function getServerSideProps(context) {
    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGO_URI)
    }
    let user;
    try {
        user = await User.findOne({ _id: context.query.slug })
    }
    catch (error) {
        console.error(error);
    }

    if (!user) {
        return {
            props: { error: 404 },
        }
    }

    return {
        props: { user: JSON.parse(JSON.stringify(user)) }, // will be passed to
    }
}
