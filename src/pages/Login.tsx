import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const apiUrl = import.meta.env.API_URL;
    

    const loginUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        try {
            const response = await axios.post(`${apiUrl}/api/users/token`, 
            formData,
             
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
            
        );
        localStorage.setItem("access_token", response.data.access_token);
        console.log(response.data);
        navigate("/");
        } catch(err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || err.message);
                console.error(err.response?.data?.detail || err.message);
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
            <form onSubmit={loginUser} className="w-full">
                <legend className="text-3xl text-blue-700 font-extrabold mb-4">Login into your account</legend>
                <fieldset className="ring-2 ring-indigo-600 p-3 px-8 rounded-md">

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
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="text-xl text-gray-800 font-medium"
                        >
                            Password
                        </label>
                        <div>
                            <input id="password"
                                   className="border border-gray-900 rounded-md w-full p-2"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   minLength={8}
                                   maxLength={200}
                                   type="password"
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
                            Login
                        </button>
                    </div>

                    <p>Don't have an account? register <Link className={"text-blue-900 underline"} to={"/register"}>here</Link></p>
                </fieldset>
            </form>
        </div>
    );
};

export default Login;