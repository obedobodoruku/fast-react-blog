import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePost = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState("");
    

    const { id } = useParams();
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
                const user = response.data;
                console.log(user);

                const fetchPost = await axios.get(`${apiUrl}/api/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (user.id !== fetchPost.data.user_id) {
                    throw new Error("You are not authorized to edit the post");
                }

                setTitle(fetchPost.data.title);
                setContent(fetchPost.data.content);
                console.log(fetchPost.data);

            } catch(err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.detail || err.message);
                } else if (err instanceof Error) {
                    setError(err.message);
                 } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
            
        };

        getCurrentUser();
    }, [token, id, apiUrl]);

    const updatePost = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/posts/${id}`, {
                title,
                content,
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            navigate("/");
        } catch(err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.detail || err.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

    if (isLoading) {
        return <h1 className="text-2xl font-medium">Loading...</h1>
    }


    if (error) {
        return <h1 className="text-2xl font-medium">Error: {error}</h1>
    }

    return (
        <div>
             <form onSubmit={updatePost} className="w-full">
                <legend className="text-3xl text-blue-700 font-extrabold mb-4">Update your Post</legend>
                <fieldset className="ring-2 ring-indigo-600 p-3 px-8 rounded-md">

                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="text-xl text-gray-800 font-medium"
                        >
                            Title
                        </label>
                        <div>
                            <input id="title"
                                   className="border border-gray-900 rounded-md w-full p-2"
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                                   minLength={1}
                                   maxLength={200}
                                   required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="content"
                            className="text-xl text-gray-800 font-medium"
                        >
                            Content
                        </label>
                        <div>
                            <textarea id="content"
                                   className="border border-gray-900 rounded-md w-full p-2"
                                   value={content}
                                   onChange={(e) => setContent(e.target.value)}
                                   minLength={1}
                                  
                                   required
                            />
                        </div>
                    </div>
                    <div>
                        {error && <span className={"text-red-700 font-bold"}>{error}</span>}
                    </div>
                    <div className={"font-bold my-4"}>
                        <button 
                        className='p-2 w-37.5 text-[0.85rem]  rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white
                        hover:from-indigo-600'
                        type="submit"
                        >
                            post
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default UpdatePost;