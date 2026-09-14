import {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface PagePost {
    id: number;
    title: string;
    content: string;
    author: {
        username: string;
    };
    date_posted: string;
}

const AccountPosts = () => {
    const [post, setPost] = useState<PagePost | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem('access_token');

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchPosts = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/posts/${id}`);
                setPost(response.data);
                console.log(response.data);
            } catch(err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || err.message);
                console.log(err.response?.data?.detail || err.message);
            } else {
                setError("Something went wrong");
            }
           
        } finally {
            setIsLoading(false);
        }
        };

        fetchPosts();
    }, [id, apiUrl]);

    const deletePost = async (): Promise<void> => {
        try {
            await axios.delete(`${apiUrl}/api/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate("/");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || err.message);
                console.log(err.response?.data?.detail || err.message);
            } else {
                setError("Something went wrong");
            }
        }
    }

    if (isLoading) {
        return <h2 className='text-2xl font-bold'>Loading...</h2>
    }

    if (error) {
        return <h2 className='text-2xl font-bold'>Error: <span className='text-red-700'>{error}</span></h2>
    }

    return (
        <div>
            <div>
                <ul>
                    {post ? <li className="mb-8 ring-2 ring-indigo-600 py-4 pl-2 rounded-md" key={post.id}>
                        <h2 className='text-2xl hover:underline cursor-pointer'>{post.title}</h2>
                        <p>{post.content}</p>
                        <p>By <span className='font-bold'>{post.author.username}</span></p>
                        <span>{post.date_posted}</span>
                        <div className='flex flex-row gap-4'>
                        <div className={"font-bold my-4"}>
                            <button onClick={() => navigate(`/posts/${post.id}/update`)}
                            className='p-2 w-[150px] text-[0.85rem] rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white
                            hover:from-indigo-600
                            '
                            type="button"
                            >
                                Update Post
                            </button>
                        </div>
                            <div className={"font-bold my-4"}>
                                <button
                                onClick={deletePost}
                                className='p-2 w-37.5 text-[0.85rem]  rounded-md bg-gradient-to-r from-red-500 to-red-700 text-white
                                hover:from-red-600
                                '
                                type="button"
                                >
                                    delete
                                </button>
                            </div>
                        </div>
                    </li> : ""}
                    
                </ul>
            </div>
        </div>
    );

}
    

export default AccountPosts;