import React, { useEffect, useState } from 'react'
import logo from "../../Assets/logo.png"
import './sidebar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../Feature/Userslice';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useTranslation } from 'react-i18next'

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useTranslation(['sidebar']);
    
const navigate=useNavigate()
  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.open-btn')) {
        closeSidebar();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [sidebarOpen]);
  const logoutFunction=()=>{
    signOut(auth)
    navigate("/")
  
}
  const user=useSelector(selectUser)
  return (

    <>
  <div className="App2 -mt-2 overflow-hidden"  >
      <Link to="/">
  <img src={logo} alt=""  id='nav2-img'/>    </Link>  
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <span  className="cursor-pointer close-btn" onClick={closeSidebar}>
            &times;
          </span>
          {user?(
  <>
  <div className="profile">
   <Link to={"/profile"}>
   <img className='rounded-full justify-center' src={user.photo} alt="" srcset="" />
   </Link> 
    <p className=' text-center'>{t('sidebar:profile_name')}<span className='font-bold text-blue-500'>{user?.name}</span></p>
  </div>
  </>
):
(

  
  <div className="auth">
  
</div>
  ) 
}
          <Link to="/internship">{t('sidebar:internships')} </Link>
    <Link to="/Jobs">{t('sidebar:Jobs')} </Link>
       
       <Link to={"/"} className='small'>{t('sidebar:contact_us')}</Link> 
<hr />
{user?(
  <>
  <div className="addmore">
    
    {user?(
  <Link to={"/userapplication"}>
  <p>{t('sidebar:my_applications')}</p>
  </Link>
    ):(
      <Link to={"/register"}>
      <p>{t('sidebar:my_applications')}</p>
      </Link>
    )

    }

  <Link>
  
  <p>{t('sidebar:view_resume')}</p>
  </Link>
  <Link>
  <p>{t('sidebar:more')}</p>
  </Link>
  <button className='bt-log' id='bt' onClick={logoutFunction}>{t('sidebar:logout')} <i class="bi bi-box-arrow-right"></i></button>
  <br />
  <br />
<button onClick={logoutFunction}>{t('sidebar:logout')} <i class="bi bi-box-arrow-right"></i></button>
  
  </div>
  </>
):
(

  
  <div className="addmore">
  <p>{t('sidebar:register_student')}</p>
  <p>{t('sidebar:register_employer')}</p>
  <br />
  <br />

  </div>
  ) 
}

        </div>


        <div className="main">
          <span style={{fontSize:"22px"}} className="open-btn" onClick={openSidebar}>
            &#9776; 
          </span>
        </div>
        
<div className="search2">
<i class="bi bi-search"></i>
    <input type="search"  placeholder='Search'/>
</div>


{user?(
  <>

  </>
):
(

  <>
  <div className="reg">
    
  <Link to="/register" >   <button  className='btn4'>
  {t('sidebar:register')}</button></Link>
  </div>
  <div className="admin">

<Link to={"/adminLog"}>
<button id='admin'> {t('sidebar:admin')}</button>
</Link>
</div>
  </>



  ) 
}


<p className='text-red-300'>{t('sidebar:hire_talent')}</p>

      </div>
    </>
    
  )
}

export default Sidebar
