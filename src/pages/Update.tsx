import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface PageUser {
    id: number;
    username: string;
    email: string;
}

const Update = () => {
    const [currentUser, setCurrentUser] = useState<PageUser | null>(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const token = localStorage.getItem("access_token");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.API_URL;

    useEffect(() => {
        const getCurrentUser = async (): Promise<void> => {
            try {
                const response = await axios.get(`${apiUrl}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = response.data;
            setCurrentUser(user);
            

            setUsername(user.username);
            setEmail(user.email);
            
            
            console.log(user);
            }catch(err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.detail || err.message)
                    console.error(err.response?.data?.detail || err.message);
                } else {
                    console.error('Network Error');
                }
            }
            
        };

        getCurrentUser();
    }, [token, apiUrl])


    

    const updateUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            if (currentUser) {
                
                const response = await axios.patch(`${apiUrl}/api/users/${currentUser.id}`, {
                username,
                email
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
            console.log(response.data);
            navigate("/account");
        }
            
        } catch(err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.detail || err.message)
                    console.error(err.response?.data?.detail || err.message);
                } else {
                    console.error('Network Error');
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
            <form onSubmit={updateUser} className="w-full">
                <legend className="text-3xl text-blue-700 font-extrabold mb-4">Update your account</legend>
                <fieldset className="ring-2 ring-indigo-600 p-3 px-8 rounded-md">
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="text-xl text-gray-800 font-medium"
                        >
                            Username
                        </label>
                        <div>
                            <input id="username"
                                   className="border border-gray-900 rounded-md w-full p-2"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)}
                                   minLength={4}
                                   maxLength={200}

                                   required
                            />
                        </div>
                        
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="text-xl text-gray-800 font-medium"
                        >
                            Email
                        </label>
                        <div>
                            <input id="email"
                                   className="border border-gray-900 rounded-md w-full p-2"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   maxLength={150}
                                   type="email"
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
                                Update Account
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

export default Update;