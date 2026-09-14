import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;

    const createPost = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/posts`, {
                title,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setTitle("");
            setContent("");
            navigate("/");


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
    }

    if (isLoading) {
        return <h1 className="text-2xl font-medium">Loading...</h1>
    }

    return (
        <div>
            <form onSubmit={createPost} className="w-full">
                <legend className="text-3xl text-blue-700 font-extrabold mb-4">Create a Post</legend>
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
                    <div className='flex flex-row gap-4'>
                        <div className={"font-bold my-4"}>
                            <button 
                            className='p-2 w-[150px] text-[0.85rem] rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white
                            hover:from-indigo-600
                            '
                            type="submit"
                            >
                                post
                            </button>
                        </div>
                            <div className={"font-bold my-4"}>
                                <button
                                onClick={() => navigate("/account")} 
                                className='p-2 w-37.5 text-[0.85rem]  rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white
                                hover:from-indigo-600
                                '
                                type="button"
                                >
                                    cancel
                                </button>
                            </div>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default Posts;