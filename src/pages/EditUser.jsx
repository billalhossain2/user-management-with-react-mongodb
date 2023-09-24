import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditUser = () => {
  const {userId} = useParams()
  const [user, setUser] = useState(null);

  const [genderStatus, setGenderStatus] = useState("")
  const [statusValue, setStatusvalue] = useState("")

  useEffect(()=>{
    fetch(`https://user-management-mongo-express-server-ogf7jct4o.vercel.app/user/?id=${userId}`)
    .then(res => res.json())
    .then(data =>{
      setUser(data)
      setGenderStatus(data.gender)
      setStatusvalue(data.status)
    })
    .catch(error => console.log(error.message))
  }, [])
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    const form = e.target;
    const name = form.userName.value;
    const email = form.email.value;
    const gender = form.gender.value;
    const status = form.status.value;

    //validate empty fields
    if(!name || !email || !gender || !status){
      return alert("All fields are mandatory")
    }

    //update to DB
    fetch(`https://user-management-mongo-express-server-ogf7jct4o.vercel.app/user/${userId}`, {
      method:"PUT",
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify({name, email, gender, status})
    })
    .then(res => res.json())
    .then(result => {
      if(result.acknowledged && result.modifiedCount === 1){
        toast("Successfully updated", {autoClose:1000})
      }
    })
    .catch(error => console.log(error.message))
  }

  const handleChange = (ev)=>{
    setGenderStatus(ev.target.value)
  }

  const handleStatusChange = (e)=>{
    setStatusvalue(e.target.value)
  }
  return (
    <div className="px-3">
      <Header></Header>
      <Link to="/">
        <p>
          <i className="fa-solid fa-arrow-left-long me-2 my-5"></i>
          <span>All Users</span>
        </p>
      </Link>
      <div className="bg-[#ece8e8] py-5 flex flex-col items-center">
        <div className="text-center my-5">
          <h3 className="text-2xl font-semibold mb-2">Update User</h3>
          <p className="text-[16px] text-[#615d5d]">
            Use the below form to update user
          </p>
        </div>
        <form className="w-[60%] mx-atuo p-3 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block" htmlFor="name">
              Name
            </label>
            <input
              className="outline-none p-2 rounded-sm w-[100%]"
              placeholder="Your name"
              type="text"
              name="userName"
              id="name"
              defaultValue={user?.name}
            />
          </div>
          <div>
            <label className="block" htmlFor="country">
              Email
            </label>
            <input
              className="outline-none p-2 rounded-sm w-[100%]"
              placeholder="Your email"
              type="email"
              name="email"
              id="name"
              defaultValue={user?.email}
            />
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <input
              className="ml-8"
              type="radio"
              name="gender"
              value="Male"
              id="male"
              checked={genderStatus==="Male"}
              onChange={handleChange}
            />
            <label className="ml-2" htmlFor="male">
              Male
            </label>
            <input
              className="ml-8"
              type="radio"
              name="gender"
              value="Female"
              id="female"
              checked={genderStatus==="Female"}
              onChange={handleChange}
            />
            <label className="ml-2" htmlFor="female">
              Female
            </label>
            <input
              className="ml-8"
              type="radio"
              name="gender"
              value="Other"
              id="other"
              checked={genderStatus==="Other"}
              onChange={handleChange}
            />
            <label className="ml-2" htmlFor="other">
              Other
            </label>
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <input
              className="ml-8"
              type="radio"
              name="status"
              value="Active"
              id="active"
              checked={statusValue === "Active"}
              onChange={handleStatusChange}
            />
            <label className="ml-2" htmlFor="active">
              Active
            </label>
            <input
              className="ml-8"
              type="radio"
              name="status"
              value="Inactive"
              id="inactive"
              checked={statusValue === "Inactive"}
              onChange={handleStatusChange}
            />
            <label className="ml-2" htmlFor="inactive">
              Inactive
            </label>
          </div>
          <div>
            <button className="bg-[#16DB93] w-[100%] rounded-sm p-2 text-white font-bold">
              Update
            </button>
          </div>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default EditUser;
