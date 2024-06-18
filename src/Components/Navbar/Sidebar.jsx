import React, { useEffect, useState } from 'react'
import logo from '../../Assets/6.png'
import {Route , Link} from 'react-router-dom'

function Sidebar() {
    const[sidebarOpen,setSidebarOpen]=useState(false)
    const opensidebar=()=>{
        setSidebarOpen(true)
    }
    const closeSidebar=()=>{
        setSidebarOpen(false)
    }
    useEffect(()=>{
        const handleOutsideClick=(e)=>{
            if(sidebarOpen && !e.target.closest('.sidebar')
            && !e.target.closest('open-btn')){
                closeSidebar()
            }
        }
        document.addEventListener('click',handleOutsideClick)
        return()=>{
            document.removeEventListener('click',handleOutsideClick)
        }
    },[sidebarOpen]);

    const user=1;

    const logoutFunction=()=>{

    }

  return  (
    <>
    <div className='App2 -mt2 overflow-hidden'>
    <Link to="/">
            <img src={logo} alt="" id="nav2-img"></img>
    </Link>   
        <div className={`sidebar ${sidebarOpen ? 'open' : ""}`}>
            <span className='cursor-pointer close-btn' onClick={closeSidebar}>
                &times;
            </span>

            {
                user?(
                    <>
                        <div className="profile">
                            <Link to={"/profile"}>
                                <img className='rounded-full justify-center' src={user.photo} alt="" srcset="" />
                            </Link>
                            <p className='text-center'>Profile name <span className='font-bold text-blue-500'>
                                {user?.name}</span></p>
                        </div>
                    </>
                ):(
                    <>
                        <div className="auth"></div>
                    </>
                )
            }

            <Link to="/internship">internship</Link>
            <Link to="/Jobs">Jobs</Link>
            <Link to={"/"} className='small'>contact Us</Link>
            <hr1/>

            {
                user?(
                    <Link to={'/userapplication'}>
                        <p>My Applications</p>
                    </Link>
                ):(
                    <>
                    <Link to={'/register'}>
                    <p>My Applications</p>
                    </Link> 
               
                    <Link>
                        <p>View Resume</p>
                    </Link>
                    <Link>
                        <p>More</p>
                    </Link>
                    <button className='bt-log' id='bt' onClick={logoutFunction}></button>
                    </>
                ):(
                    <>
                    
                    </>
                )
            }
            </div>
    </div>
    </>
  )
}

export default Sidebar