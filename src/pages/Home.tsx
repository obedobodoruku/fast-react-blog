import { useState, useEffect} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';


interface PagePosts {
    id: number;
    title: string;
    content: string;
    author: {
        username: string;
        id: number;
    };
    date_posted: string;
}

const Home = () => {
    const [data, setData] = useState<PagePosts[]>([]);
    const [skip, setSkip] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useState();
    const [hasMore, setHasMore] = useState<boolean>(true);

    const apiUrl = import.meta.env.API_URL;

    useEffect(() => {
        const fetchPosts = async (): Promise<void> => {
            setIsLoading(true);
            const token = localStorage.getItem("access_token");

            try {
                const response = await axios.get(`${apiUrl}/api/posts`);
                setData(response.data.posts);
                console.log(response.data.posts);
                setHasMore(response.data.has_more);
                if (token) {
                    const res = await axios.get(`${apiUrl}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const user = res.data;
                setLoggedIn(user);
                console.log(user)
                }

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
    }, [apiUrl]);

    const loadMore = async (): Promise<void> => {
        const nextSkip = skip + 10;
        const response = await axios.get(`${apiUrl}/api/posts`, {
            params: {
                skip: nextSkip,
                limit: 10
            }
        });
        setData(prevPosts => [...prevPosts, ...response.data.posts]);
        setSkip(nextSkip);
        setHasMore(response.data.has_more);
        console.log(response.data);
    };

    if (isLoading) {
        return <h2 className='text-2xl font-bold'>Loading...</h2>
    }

    

    return (
        <div>
            {error && <h2 className='text-2xl font-bold'>Error: {error}</h2>}
            <div>
                <ul>
                    {data.map((post) => (
                        <li className="mb-8 ring-2 ring-indigo-600 py-4 pl-2 rounded-md" key={post.id}>
                            {loggedIn ?
                                <h2 className='text-2xl hover:underline cursor-pointer'><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
                                : <h2 className='text-2xl'>{post.title}</h2>
                            }
                            <p>{post.content}</p>
                            <p>By  
                                 {loggedIn ? <Link to={`/users/${post.author.id}/posts`} className='font-bold hover:underline'>{post.author.username}</Link> : <span  className='font-bold'>{post.author.username}</span>}
                            </p>
                            <span>{post.date_posted}</span>
                        </li>
                    ))}
                </ul>
                {loggedIn ? "" : <p className='text-center mt-10'>Register or log in to access or create a blog post</p>}
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
        </div>
    );
};

export default Home;