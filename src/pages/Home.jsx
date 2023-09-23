import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const handleNavigation = () => navigate("/addUser");
  // API: https://user-management-mongo-express-server-htjk4erqb.vercel.app/

  const [users, setUsers] = useState([]);
//retrieve data from mongo DB
  useEffect(() => {
    fetch(
      "https://user-management-mongo-express-server-htjk4erqb.vercel.app/users"
    )
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  //delete data from client and DB
  const handleDeleteUser = (userId)=>{
    //delete from DB
    fetch(`https://user-management-mongo-express-server-htjk4erqb.vercel.app/user/${userId}`, {method:"DELETE"})
    .then(res => res.json())
    .then(result => {
      if(result.acknowledged){
        alert("Successfully deleted!")
         //delete from UI
          const restUsers = users.filter(user=> user._id !== userId)
          setUsers(restUsers)
      }
    })
    .catch(error => console.log(error.message))
  }
  return (
    <div>
      <Header></Header>
      <div className="mb-8">
        <button
          onClick={handleNavigation}
          className="border-solid border-[1px] border-gray-400 p-2 rounded-lg"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="mx-2">New User</span>
          <i className="fa-regular fa-user"></i>
        </button>
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
              users?.map(user =>(
                <tr key={user?._id}>
                <td className="px-10 py-5">{user.name}</td>
                <td className="px-10 py-5">{user.email}</td>
                <td className="px-10 py-5">{user.gender}</td>
                <td className="px-10 py-5">{user.status}</td>
                <td className="px-10 py-5 space-x-5">
                  <Link to={`/user/${user._id}`}>
                    <i className="fa-solid fa-pen bg-[#d6cfcf] p-2 rounded-sm text-[#774320] cursor-pointer"></i>
                  </Link>
                  <i onClick={()=>handleDeleteUser(user._id)} className="fa-solid fa-xmark bg-[#d6cfcf] p-2 rounded-sm text-[#774320] cursor-pointer"></i>
                </td>
              </tr>
              ))
            }
        </tbody>
      </table>
    </div>
  );
};

export default Home;
