import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Navbar from "./Navbar.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import Account from './pages/Account.tsx';
import Update from './pages/Update.tsx';
import Posts from './pages/Posts.tsx';
import Post from './pages/Post.tsx';
import UpdatePost from './pages/UpdatePost.tsx';
import AccountPosts from './pages/AccountPosts.tsx';
import UserPosts from './pages/UserPosts.tsx';

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/update" element={<Update />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="posts/:id/info" element={<AccountPosts />} />
                <Route path="/posts/:id/update" element={<UpdatePost />} />
                <Route path="/posts/:id" element={<Post />} />
                <Route path="/users/:id/posts" element={<UserPosts />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;