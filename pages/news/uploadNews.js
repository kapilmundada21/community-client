import axios from 'axios';
import Head from 'next/head';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from 'formik';
import { uploadNewsSchema } from "@/validationSchema";
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';
import { MuiFileInput } from 'mui-file-input'

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>
});

const QuillEditor = ({ onChange, value }) => {
    const handleChange = (content) => {
        onChange(content);
    };

    return <ReactQuill value={value} onChange={handleChange} placeholder="Description *" className='h-52 mb-24 md:mb-12' />;
};

function UploadNews() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [file, setFile] = useState(null)

    useEffect(() => {
        let localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser && !user) {
            setUser(localUser);
            setValue('publishedBy', localUser.name);
        }

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
    }, [user])

    const { handleSubmit, register, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(uploadNewsSchema)
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post(`/api/news/post`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success && response.data.status === 'Pending') {
                toast.success('News Uploaded Successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                router.push('/news');
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
    };

    const handleEditorChange = (description) => {
        setValue('description', description);
        setEditorContent(description);
    };

    const handleUploaderChange = (files) => {
        setValue('files', files);
        setFile(files)
    };

    return (
        <>
            <Head>
                <title>{`Upload News | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
            </Head>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1, display: 'flex', justifyContent: "center" }}
            >
                <div className="mb-8 max-w-3xl">
                    <h3 className="mt-3 rounded-lg font-semibold text-2xl text-center">
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
                                {...register('title')}
                                fullWidth
                            />
                            {errors.title ? (<p className="text-red-600 text-sm">{errors.title.message}</p>) : null}
                        </Grid>
                        <Grid item xs={2} sm={6} md={12}>
                            <QuillEditor
                                id="description"
                                name="description"
                                onChange={handleEditorChange}
                                value={editorContent}
                            />
                            {errors.description ? (<p className="text-red-600 text-sm">{errors.description.message}</p>) : null}
                        </Grid>
                        <Grid item xs={2} sm={6} md={6}>
                            <TextField
                                required
                                id="img"
                                label="Image URL"
                                {...register('img')}
                                fullWidth
                            />
                            {errors.img ? (<p className="text-red-600 text-sm">{errors.img.message}</p>) : null}
                        </Grid>
                        {/* <Grid item xs={2} sm={6} md={6}>
                            <MuiFileInput
                                id="files"
                                name="files"
                                value={file}
                                onChange={handleUploaderChange}
                                label="News Image *"
                                multiple={true}
                            />
                            {errors.files && (<p className="text-red-600 text-sm">{errors.files.message}</p>)}
                        </Grid> */}
                        <Grid item xs={2} sm={6} md={6}>
                            <TextField
                                required
                                id="publishedBy"
                                label="Published By"
                                {...register('publishedBy')}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            {errors.publishedBy ? (<p className="text-red-600 text-sm">{errors.publishedBy.message}</p>) : null}
                        </Grid>
                    </Grid>
                    <center>
                        <Button
                            type="submit"
                            variant="contained"
                            className='disabled:bg-blue-300 disabled:text-white bg-[#1976d2] w-[80%] md:w-min'
                        >
                            Upload
                        </Button>
                    </center>
                </div>
            </Box>
        </>
    );
}

export default UploadNews;