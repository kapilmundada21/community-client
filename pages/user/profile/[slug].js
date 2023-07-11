import User from '@/models/user';
import mongoose from "mongoose";
import axios from 'axios';
import Error from 'next/error';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WcIcon from '@mui/icons-material/Wc';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar, Button, CircularProgress, Divider, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import NewsCard from '@/components/NewsCard';
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from '@/components/Modal';
import EditUser from '@/components/Modals/EditUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewsModal from '@/components/Modals/NewsModal';

const Profile = ({ error, user }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [myUser, setMyUser] = useState(user);
    const [allNews, setAllNews] = useState([]);
    const [newsForModal, setNewsForModal] = useState({});
    const [totalNews, setTotalNews] = useState(0);
    const [page, setPage] = useState(0);
    const [offset, setOffset] = useState(6);
    const [loading, setLoading] = useState(true);
    const [openEditUserModal, setOpenEditUserModal] = useState(false);
    const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
    const [openEditNewsModal, setOpenEditNewsModal] = useState(false);
    const [openDeleteNewsModal, setOpenDeleteNewsModal] = useState(false);
    const [rerenderComponent, setRerenderComponent] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event, news) => {
        setNewsForModal(news);
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const initialPost = async () => {
        try {
            const response = await axios.get(`/api/news/getByUserId`, {
                params: {
                    userId: slug,
                    page: 0,
                    offset: offset,
                }
            });
            const parsedData = response.data;
            setAllNews(Array.from(parsedData.allNews));
            setTotalNews(parsedData.totalNews);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    const updatePost = async () => {
        setLoading(true);
        setPage(page + 1)
        try {
            const response = await axios.get(`/api/news/getByUserId`, {
                params: {
                    userId: slug,
                    page: page + 1,
                    offset: offset,
                }
            });
            const parsedData = response.data;
            setAllNews(allNews.concat(Array.from(parsedData.allNews)));
            setTotalNews(parsedData.totalNews);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        initialPost()
        //eslint-disable-next-line
    }, [rerenderComponent])

    useEffect(() => {
        //eslint-disable-next-line
    }, [myUser])

    if (error == 404) {
        return <Error statusCode={404} />
    }

    const extractFirstCharacters = (str) => {
        const words = str?.split(' ');
        const firstCharacters = [];

        for (let i = 0; i < words?.length; i++) {
            if (words[i]) {
                firstCharacters.push(words[i][0].toUpperCase());
            }
        }

        return firstCharacters.join('');
    }

    const editUserProfile = async (e) => {
        e.preventDefault();

        const data = {
            ...myUser,
            status: (myUser.status === "Rejected") ? "Pending" : myUser.status,
        };
        setMyUser(data);
        try {
            const response = await axios.patch(`/api/user/patch`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success) {
                closeModal();
                toast.success("Profile updated successfully!", {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
            console.error('Error fetching data:', error);
        }
    }

    const deleteUserProfile = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.delete(`/api/user/delete`, {
                params: {
                    id: slug,
                }
            });
            if (response.data.success) {
                localStorage.removeItem('user');
                router.push('/login');
                toast.success('User Profile deleted successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
            console.error('Error fetching data:', error);
        }
    }

    const handleEditNews = async (e) => {
        e.preventDefault();

        const data = newsForModal;
        try {
            const response = await axios.patch(`/api/news/patch`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.success) {
                setRerenderComponent(!rerenderComponent);
                closeModal();
                toast.success("News updated successfully!", {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
            console.error('Error fetching data:', error);
        }
    }

    const handleDeleteNews = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.delete(`/api/news/delete`, {
                params: {
                    id: newsForModal._id,
                }
            });
            if (response.data.success) {
                setRerenderComponent(!rerenderComponent);
                closeModal();
                toast.success('News deleted successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
            console.error('Error fetching data:', error);
        }
    }

    const closeModal = () => {
        setOpenEditUserModal(false);
        setOpenDeleteUserModal(false);
        setOpenEditNewsModal(false);
        setOpenDeleteNewsModal(false);
    };

    const handleUserChange = (e) => {
        if (e.target.name) {
            setMyUser({ ...myUser, [e.target.name]: e.target.value });
        }
        else {
            setMyUser({ ...myUser, [e.target.id]: e.target.value });
        }
    }

    const handleNewsChange = (e) => {
        if (e.target.name) {
            setNewsForModal({ ...newsForModal, [e.target.name]: e.target.value });
        }
        else {
            setNewsForModal({ ...newsForModal, [e.target.id]: e.target.value });
        }
    }

    return (
        <>
            <Head>
                <title>{`Profile | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
            </Head>

            {openEditUserModal && (
                <Modal
                    title="Edit User Info"
                    endTitle="Save Changes"
                    onClose={closeModal}
                    handleSubmit={(e) => editUserProfile(e)}
                    showmodal={openEditUserModal}
                    hasfooter={"true"}
                >
                    <EditUser user={myUser} handleChange={handleUserChange} />
                </Modal>
            )}
            {openDeleteUserModal && (
                <Modal
                    title="Conform Delete Profile"
                    endTitle="Delete"
                    onClose={closeModal}
                    handleSubmit={(e) => deleteUserProfile(e)}
                    showmodal={openDeleteUserModal}
                    hasfooter={"true"}
                />
            )}
            {openEditNewsModal && (
                <Modal
                    title="Edit news Info"
                    endTitle="Save Changes"
                    onClose={closeModal}
                    handleSubmit={(e) => handleEditNews(e)}
                    showmodal={openEditNewsModal}
                    hasfooter={"true"}
                >
                    <NewsModal news={newsForModal} handleChange={handleNewsChange} />
                </Modal>
            )}
            {openDeleteNewsModal && (
                <Modal
                    title="Conform Delete News"
                    endTitle="Delete"
                    onClose={closeModal}
                    handleSubmit={(e) => handleDeleteNews(e)}
                    showmodal={openDeleteNewsModal}
                    hasfooter={"true"}
                />
            )}


            <div className='px-2 md:px-4 md:mx-[9%] bg-[#f7f8fa]'>
                <div className='flex flex-col'>
                    <Image
                        src={"/images/user-profile-bg-image.jpg"}
                        alt={"imageLabel"}
                        width={1250}
                        height={30}
                        className='w-full h-[15vh] md:h-[30vh] self-center'
                        loading="lazy"
                    />
                    <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
                        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 md:items-center'>

                            <IconButton sx={{ p: 0 }}>
                                <Avatar
                                    src={myUser.img}
                                    className='w-40 md:w-52 h-40 md:h-52 text-5xl rounded-full -mt-24 md:-mt-12 self-center'
                                >
                                    {extractFirstCharacters(myUser.name).slice(0, 2)}
                                </Avatar>
                            </IconButton>
                            <div className='flex flex-col'>
                                <span className='text-2xl md:text-3xl font-semibold'>{myUser.name}</span>
                                <span className='text-lg md:text-xl font-semibold'>Status: {myUser.status}</span>
                            </div>
                        </div>
                        <div className='flex space-x-4'>
                            <Button size="small" variant="contained" className='bg-[#1976d2]' onClick={() => setOpenEditUserModal(true)}>
                                {(myUser.status === "Rejected") ? "ReApply" : "Edit Profile"}
                            </Button>
                            <Button size="small" variant="contained" className='bg-[#1976d2]' onClick={() => setOpenDeleteUserModal(true)}>
                                Delete Profile
                            </Button>
                        </div>
                    </div>
                </div>

                <Divider className='py-4' />

                {
                    myUser &&
                    <Grid
                        container
                        spacing={4}
                        columns={{ xs: 2, sm: 6, md: 12 }}
                        className='py-3 md:p-3'
                    >
                        <Grid item xs={2} sm={6} md={6}>
                            <EmailIcon /> {myUser.email}
                        </Grid>
                        <Grid item xs={2} sm={6} md={6}>
                            <WcIcon /> {myUser.gender}
                        </Grid>
                        <Grid item xs={2} sm={6} md={6}>
                            <LocationOnIcon /> {myUser.city}, {myUser.state}
                        </Grid>
                        {
                            (myUser.status === "Rejected") &&
                            <Grid item xs={2} sm={6} md={12}>
                                <strong>Rejection Message: </strong> {user.rejectionMessage}
                            </Grid>
                        }

                    </Grid>
                }

                <Divider />

                {
                    (myUser.status === "Approved") &&
                    <div className='py-4 space-y-2'>
                        <h2 className='text-3xl font-semibold'>My Posts</h2>
                        <InfiniteScroll
                            dataLength={(page + 1) * offset}
                            next={updatePost}
                            hasMore={((page + 1) * offset) <= totalNews}
                            className='py-4 md:py-8'
                        >

                            <Grid
                                container
                                spacing={{ xs: 2, md: 5 }}
                                columns={{ xs: 1, sm: 8, md: 12 }}
                            >
                                {Object.keys(allNews).map((news, index) => (
                                    <Grid item xs={2} sm={4} md={4} key={index} className='flex flex-col justify-center'>

                                        <MoreHorizIcon
                                            id="basic-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={(event) => handleClick(event, allNews[index])}
                                            className='w-min relative left-[80%] px-2 -mb-7 bg-white rounded-full cursor-pointer'
                                        />
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={() => {
                                                setOpenEditNewsModal(true);
                                                handleClose();
                                            }}>Edit</MenuItem>
                                            <MenuItem onClick={() => {
                                                setOpenDeleteNewsModal(true);
                                                handleClose();
                                            }}>Delete</MenuItem>
                                        </Menu>
                                        <NewsCard news={allNews[index]} />
                                    </Grid>
                                ))}

                                {
                                    !(allNews.length) && !loading &&
                                    <Grid item xs={2} sm={4} md={3} className='mb-8 text-center'>
                                        No post available
                                    </Grid>
                                }
                            </Grid>

                        </InfiniteScroll>

                        {loading && (
                            <div className="flex justify-center mt-5">
                                <CircularProgress />
                            </div>
                        )}
                    </div>
                }
            </div>
        </>
    );
}

export default Profile;

export async function getServerSideProps(context) {
    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGO_URI)
    }

    let user;
    try {
        user = await User.findOne({ _id: context.query.slug });
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