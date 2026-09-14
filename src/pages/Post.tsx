import {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface PagePost {
    id: number;
    title: string;
    content: string;
    author: {
        username: string;
    };
    date_posted: string;
}

const Post = () => {
    const [post, setPost] = useState<PagePost | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { id } = useParams();

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
    }, [id]);

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
                    </li> : ""}
                    
                </ul>
            </div>
        </div>
    );

}
    

export default Post;