import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useFormik } from 'formik';
import { Button } from "@mui/material";
import { uploadNewsSchema } from "@/validationSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

function UploadNews() {
    const router = useRouter();
    const [user, setUser] = useState({});
    const [validationFlag, setValidationFlag] = useState(true);
    const [errorFlag, setErrorFlag] = useState(false);

    const extractContent = (s) => {
        let span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
    };

    const validate = (e) => {
        setValidationFlag(true)
        let text = extractContent(e)
        if (text.length >= 250) {
            setValidationFlag(false);
        }
        return e;
    }

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    }

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ]

    useEffect(() => {
        async function fetchUser() {
            let localUser = JSON.parse(localStorage.getItem("user"));
            await setUser(localUser);
        }
        fetchUser();

        let localUser = JSON.parse(localStorage.getItem("user"));
        try {
            if (!localUser.token) {
                router.push("/login");
            }
        }
        catch (error) {
            if (!localUser) {
                router.push("/login");
            }
        }
        // eslint-disable-next-line
    }, [])

    const initialValues = {
        title: "",
        description: "",
        img: "",
        publishedBy: user.name ? user.name : "",
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: uploadNewsSchema,
        onSubmit: async (values) => {
            let data = {
                title: values.title,
                description: values.description,
                img: values.img,
                publishedBy: values.publishedBy,
            }
            let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/news/post`, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': ' application/json',
                },
                body: JSON.stringify(data),
            })
            let response = await res.json()
            if (response.success) {
                if (response.status === "Pending") {
                    toast.success('News Uploded Sucessfully!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    router.push("/news")
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


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, display: 'flex', justifyContent: "center" }}
        >
            <div className="m-4 md:my-8 max-w-3xl">
                <h3 className="m-1 p-2 rounded-lg font-semibold text-2xl text-center">
                    News Details
                </h3>
                <Grid
                    container
                    padding={3}
                    spacing={4}
                    columns={{ xs: 2, sm: 6, md: 12 }}
                >
                    <Grid item xs={2} sm={6} md={12}>
                        <TextField
                            required
                            id="title"
                            label="Title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                        {errors.title && touched.title ? (<p className="text-red-600 text-sm">{errors.title}</p>) : null}
                    </Grid>
                    <Grid item xs={2} sm={6} md={12}>
                        <QuillNoSSRWrapper
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            id="description"
                            name="description"
                            placeholder="Description *"
                            value={values.description}
                            onChange={e => { values.description = validate(e) }}
                            onFocus={() => setErrorFlag(true)}
                            className='h-72 pb-16'
                        />
                        {validationFlag && errorFlag ? (<p className="text-red-600 text-sm">please enter news description with minimum 250 character</p>) : null}
                    </Grid>
                    <Grid item xs={2} sm={6} md={6}>
                        <TextField
                            required
                            id="img"
                            label="Image URL"
                            value={values.img}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                        {errors.img && touched.img ? (<p className="text-red-600 text-sm">{errors.img}</p>) : null}
                    </Grid>
                    <Grid item xs={2} sm={6} md={6}>
                        <TextField
                            required
                            id="publishedBy"
                            label="Published By"
                            value={values.publishedBy}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                        {errors.publishedBy && touched.publishedBy ? (<p className="text-red-600 text-sm">{errors.publishedBy}</p>) : null}
                    </Grid>
                </Grid>
                <center>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}
                        className='disabled:bg-blue-300 disabled:text-white bg-[#1976d2]'
                        disabled={validationFlag}
                    >
                        Upload
                    </Button>
                    {validationFlag ? (<p className="text-red-500 text-sm">fields with * are required</p>) : null}
                </center>
            </div>
        </Box>
    );
}

export default UploadNews;