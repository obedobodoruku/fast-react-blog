import axios from 'axios';
import { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";

interface PageUser {
    id: number;
    username: string;
    email: string;
}

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState<PageUser| null>(null);
    const token = localStorage.getItem("access_token");

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        
        const fetchCurrentUser = async (): Promise<void> => {
            try {
                const response = await axios.get(`${apiUrl}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCurrentUser(response.data);
                console.log(response.data);
            } catch(err) {
                if (axios.isAxiosError(err)) {
                    console.error(err.response?.data?.detail || err.message);
                } else {
                    console.error('Network Error');
                }
            }

        };
        fetchCurrentUser();
    }, [token, apiUrl])
    

    return (
        <div>
            <nav className="flex flex-row justify-between items-center mb-8 p-2 border-b-2">
                <div onClick={() => navigate("/")} className="text-4xl cursor-pointer font-extrabold">LOGO</div>.
                <ul className="flex flex-row gap-4 items-center">
                    {currentUser ? <li>
                        <Link className='hover:underline' to={"/posts"}>New post</Link>
                    </li> : <li>
                        <Link  className='hover:underline' to={"/"}>Home</Link>
                    </li>}
                    {currentUser ? <li className="px-4 py-2 text-[0.85rem]  rounded-md bg-gradient-to-r from-indigo-500 to-indigo-700 text-white
                    hover:from-indigo-600'">
                        <Link  className='' to={"/account"}>{currentUser.username}</Link>
                    </li>: <li>
                        <Link  className='hover:underline' to={"/register"}>Register</Link>
                    </li>}
                    {currentUser ? "" :
                    <li>
                        <Link  className='hover:underline' to={"/login"}>Login</Link>
                    </li> }
                    
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;