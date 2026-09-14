import {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface PageUser {
    id: number;
    username: string;
    email: string;
}

interface PagePosts {
    id: number;
    title: string;
    content: string;
    author: string;
    date_posted: string;
}

const Account = () => {
    const [data, setData] = useState<PagePosts[]>([]);
    const [currentUser, setCurrentUser] = useState<PageUser | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const token = localStorage.getItem("access_token");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getCurrentUser = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = response.data
            setCurrentUser(user);
            console.log(user);

            const postResponse = await axios.get(`${apiUrl}/api/users/${user.id}/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setData(postResponse.data.posts);
            console.log(postResponse.data.posts);

            }catch(err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.detail || err.message)
                    console.error(err.response?.data?.detail || err.message);
                } else {
                    console.error('Network Error');
                }
            } finally {
                setIsLoading(false);
            }
        
            
        };

        getCurrentUser();
        
    }, [token, apiUrl]);

    const logoutUser = () => {
        localStorage.removeItem("access_token");
        setCurrentUser(null);
        navigate("/");
    }

    if (isLoading) {
        return <h1 className="text-2xl font-medium">Loading...</h1>
    };

    return (
        <div>
            {error && <h1 className="text-2xl font-medium mb-10">{error}</h1>}
            {currentUser ? <div>
                <span className="text-2xl font-extrabold">Username: </span>{currentUser.username}
                </div> : ""}
            {currentUser ? <div>
                <span className="text-2xl font-extrabold">Email: </span>{currentUser.email}
                </div> : ""}
            <div className='mt-8'>
                {currentUser ? <h2><span className='text-2xl font-medium'>{currentUser.username}</span> posts:</h2> : "" } 
            </div>
            <div className='mt-8'>
                <ul>
                    {data ? data.map((post) => (
                        <li onClick={() => navigate(`/posts/${post.id}/info`) } className="mb-8 ring-2 ring-indigo-600 py-4 pl-2 rounded-md" key={post.id}>
                            <h2 className='text-2xl'>{post.title}</h2>
                            <p>{post.content}</p>
                            <span className='font-bold'>{post.date_posted}</span>
                        </li>
                    )) : ""}
                </ul>
            </div>
            <div className={"flex flex-row justify-center items-center font-bold my-4 gap-4"}>
                <Link to={"/account/update"}>
                    <button
                    className='p-2 w-[150px] text-[0.85rem]  rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white
                    hover:from-indigo-600
                    '
                        type="button"
                    >
                        Update Account
                    </button>
                </Link>
                <div>
                    <button 
                    type='button' 
                    className='p-2 w-[150px] text-[0.85rem]  rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white
                    hover:from-indigo-600
                    ' 
                    onClick={logoutUser}>Logout</button>
                </div>
                
                    
            </div>
        </div>
    );
};

export default Account;