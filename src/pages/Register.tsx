import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const navigate = useNavigate();
    const apiUrl = import.meta.env.API_URL;

    const createUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            if (confirmPassword !== password) {
                throw new Error("Please enter the same password in both fields");
            }
            const response = await axios.post(`${apiUrl}/api/users`, {
                username,
                email,
                password,
            });

            console.log(response.data);
            navigate("/login");
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

            <form onSubmit={createUser} className="w-full">
                <legend className="text-3xl text-blue-700 font-extrabold mb-4">Create an account</legend>
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
                    <div className="mb-4">
                        <label
                            htmlFor="confirm-password"
                            className="text-xl text-gray-800 font-medium"
                        >
                            Confirm password
                        </label>
                        <div>
                            <input id="confirm-password"
                                   type='password'
                                   className="border border-gray-900 rounded-md w-full p-2"
                                   value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                   minLength={8}
                                   maxLength={200}
                                   required
                            />
                        </div>
                        
                    </div>
                    <div>
                            {error && <span className={"text-red-700 font-bold"}>{error}</span>}
                    </div>
                    <div className={"font-bold my-4"}>
                        <button 
                        className='p-2 w-[150px]  rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-[0.85rem]
                        hover:from-indigo-600
                        '
                         type="submit"
                        >
                            Create Account
                        </button>
                    </div>
                    <p>Already have an account? login <Link className={"text-blue-900 underline"} to={"/login"}>here</Link></p>
                </fieldset>
            </form>
        </div>
    );
};

export default Register;