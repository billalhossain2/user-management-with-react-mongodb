import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Home = () => {
  const navigate = useNavigate();
  const handleNavigation = () => navigate("/addUser");
  // API: https://user-management-mongo-express-server-htjk4erqb.vercel.app/

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true)
//retrieve data from mongo DB
  useEffect(() => {
    fetch(
      "https://user-management-mongo-express-server-ogf7jct4o.vercel.app/users"
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      });
  }, []);

  //delete single data from client and DB
  const handleDeleteUser = (userId)=>{
    //delete from DB
    fetch(`https://user-management-mongo-express-server-ogf7jct4o.vercel.app/user/${userId}`, {method:"DELETE"})
    .then(res => res.json())
    .then(result => {
      if(result.acknowledged){
         //delete from UI
          const restUsers = users.filter(user=> user._id !== userId)
          setUsers(restUsers)
          toast("Successfully deleted", {autoClose:1000})
      }
    })
    .catch(error => console.log(error.message))
  }

  //delete all data from client and DB
  const handleClearAll = ()=>{
    //clear all from client
    setUsers([])

    //clear all from DB
    fetch(`https://user-management-mongo-express-server-htjk4erqb.vercel.app/users`, {method:"DELETE"})
    .then(res => res.json())
    .then(result => {
      console.log(result)
    })
    .catch(error => console.log(error.message))
  }

  return (
    <div className="px-3">
      <Header></Header>
      <div className="mb-8 flex justify-between">
        <button
          onClick={handleNavigation}
          className="border-solid border-[1px] border-gray-400 p-2 rounded-lg hover:bg-[#184E40] hover:text-white duration-300"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="mx-2">New User</span>
          <i className="fa-regular fa-user"></i>
        </button>
        <div>
          <input className="px-5 py-2 rounded-md outline-none border-[1px] border-solid border-[#16db93cb] me-3" type="search" name="" id="" placeholder="Search user"/>
          <select className="px-5 py-2 rounded-md outline-none border-[1px] border-solid border-[#16db93cb]" name="" id="">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <table className="w-[100%] text-center">
        <thead className="bg-[#16db9334]">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Gender</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            loading && <tr><td className="flex justify-center" colSpan="5" rowSpan="5">
              <Spinner></Spinner>
              </td></tr>
          }
            {
              users?.map(user =>(
                <tr key={user?._id}>
                <td className="px-10 py-5">{user.name}</td>
                <td className="px-10 py-5">{user.email}</td>
                <td className="px-10 py-5">{user.gender}</td>
                <td className="px-10 py-5">{user.status}</td>
                <td className="px-10 py-5 space-x-5">
                  <Link to={`/user/${user._id}`}>
                    <i className="fa-solid fa-pen bg-[#d6cfcf] hover:bg-[#184E40] hover:text-white p-2 rounded-sm text-[#774320] cursor-pointer duration-300"></i>
                  </Link>
                  <i onClick={()=>handleDeleteUser(user._id)} className="fa-solid fa-xmark bg-[#d6cfcf] hover:bg-[#184E40] hover:text-white p-2 rounded-sm text-[#774320] cursor-pointer duration-300"></i>
                </td>
              </tr>
              ))
            }
        </tbody>
      </table>
      <div className="flex justify-center mt-5"><button onClick={handleClearAll} className={`bg-red-500 text-white px-8 py-3 rounded-md text-xl font-bold hover:bg-red-700 ${!users.length && 'hidden'}`}>Clear All</button></div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Home;
