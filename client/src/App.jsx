import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Message";
import Chatbox from "./pages/ChatBox";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Discover from "./pages/Discover";
import Connection from "./pages/Connection";
import {useUser, useAuth} from '@clerk/react'
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from "./features/connections/connectionSlice";
 


const App = () => {
  const {user} = useUser()
  const {getToken} = useAuth()
  const dispatch=useDispatch();
  
    useEffect(()=>{
      const fetchData=async()=>{
        if(user){
         const token=await getToken();
         dispatch(fetchUser(token));
         dispatch(fetchConnections(token));
        }
      }
      fetchData();
    },[user,getToken,dispatch]);


  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout/>}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Chatbox />} />
          <Route path="connections" element={<Connection />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
