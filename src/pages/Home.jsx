import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
const Home = () => {
  const navigate = useNavigate();
  const handleNavigation = () => navigate("/addUser");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true)

  const [searchTxt, setSearchTxt] = useState("")
  const [filteredTxt, setFilteredTxt] = useState("")
  const [sortStatus, setSortStatus] = useState("")

//retrieve data from mongo DB
  useEffect(() => {
    fetch(
      "https://user-management-mongo-express-server.vercel.app/users"
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      });
  }, []);

  //delete single data from client and DB
  const handleDeleteUser = (userId)=>{
    // confirm to delete 
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
    //delete from DB
    fetch(`https://user-management-mongo-express-server.vercel.app/user/${userId}`, {method:"DELETE"})
    .then(res => res.json())
    .then(result => {
      if(result.acknowledged){
         //delete from UI
          const restUsers = users.filter(user=> user._id !== userId)
          setUsers(restUsers)
      }
    })
    .catch(error => console.log(error.message))
      }
    })
  }

  //view details
  const handleViewUser = (userId)=>{

  }

  //handle sort
  const handleSortChange = (e)=>{
    setSortStatus(e.target.value)
  }

  //delete all data from client and DB
  const handleClearAll = ()=>{
    //clear all from DB
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear all!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
         //clear all from client
        setUsers([])
        fetch(`https://user-management-mongo-express-server.vercel.app/users`, {method:"DELETE"})
        .then(res => res.json())
        .then(result => {
          console.log(result)
        })
        .catch(error => console.log(error.message))
      }
    })
  }

  //handle search operation
  const handleSearchChange = (e)=>{
    setSearchTxt(e.target.value)
  }

  const handleFilterChange = (e)=>{
    setFilteredTxt(e.target.value)
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
          <input onChange={handleSearchChange} className="px-5 py-2 rounded-md outline-none border-[1px] border-solid border-[#16db93cb] me-3" type="search" name="" id="" placeholder="Search user"/>
          <select onChange={handleSortChange} className="px-5 py-2 rounded-md outline-none border-[1px] border-solid border-[#16db93cb] me-3" name="" id="">
            <option className="text-gray-300" selected disabled value="Sort By Alphabet">Sort By Alphabet</option>
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
            <option value="Default">Default</option>
          </select>
          <select onChange={handleFilterChange} className="px-5 py-2 rounded-md outline-none border-[1px] border-solid border-[#16db93cb]" name="" id="">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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
              users
              .filter((user)=>{
                if(searchTxt){
                  const pattern = new RegExp(searchTxt, "i")
                  if(user.name.match(pattern)){
                    return user;
                  }
                }else{
                  return user
                }
              })
              .filter(user => {
                if(filteredTxt){
                  if(user.status === filteredTxt || user.gender === filteredTxt){
                    return user;
                  }else if(filteredTxt === "All"){
                    return user;
                  }
                }else{
                  return user;
                }
              })
              .map(user =>(
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
                  <i onClick={()=>handleViewUser(user._id)} className="fa-regular fa-eye bg-[#d6cfcf] hover:bg-[#184E40] hover:text-white p-2 rounded-sm text-[#774320] cursor-pointer duration-300"></i>
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
