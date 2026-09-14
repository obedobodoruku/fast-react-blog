import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface PagePosts {
    id: number;
    title: string;
    content: string;
    author: {
        username: string;
    }
    date_posted: string;
}
const UserPosts = () => {
    const [postsAuthor, setPostAuthor] = useState<string | null >(null);
    const [skip, setSkip] = useState(0);
    const [posts, setPosts] = useState<PagePosts[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [hasMore, setHasMore] = useState(true);

    const { id } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUserPosts = async (): Promise<void> => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/users/${id}/posts`);
                setPosts(response.data.posts);
                setPostAuthor(response.data.posts[0].author.username);
                setHasMore(response.data.has_more);
                console.log(response.data.posts);
            } catch(err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.detail || err.message);
                    console.error(err.response?.data?.detail || err.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [id, apiUrl]);

    const loadMore = async (): Promise<void> => {
        const nextSkip = skip + 10;
        const response = await axios.get(`${apiUrl}/api/users/${id}/posts`, {
            params: {
                skip: nextSkip,
                limit: 10
            }
        });
        setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        setSkip(nextSkip);
        setHasMore(response.data.has_more);
        console.log(response.data.posts);
    };

    if (loading) {
        return <h1 className="text-2xl font-medium">Loading...</h1>
    }


    if (error) {
        return <h1 className="text-2xl font-medium">Error: {error}</h1>
    }

    return (
        <div>
            <div className='mt-8'>
                { postsAuthor ? <h2><span className='text-2xl font-medium'>{postsAuthor}'s</span> posts:</h2> : <h2 className='text-2xl font-medium'>posts:</h2>}
            </div>
            <div className='mt-8'>
                <ul>
                    {posts.map((post) => (
                        <li  className="mb-8 ring-2 ring-indigo-600 py-4 pl-2 rounded-md" key={post.id}>
                            <h2 className="text-2xl">{post.title}</h2>
                            <p>{post.content}</p>
                            <span>{post.date_posted}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {hasMore && <div className={"flex flex-row justify-center items-center font-bold my-4"}>
                       <button 
                        onClick={loadMore}
                        className='p-2 w-[150px]  rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-[0.85rem]
                        hover:from-indigo-600
                        '
                         type="button"
                        >
                            Load more posts
                        </button>
                 </div>}
        </div>
    );
};

export default UserPosts;