import React, { useEffect, useState } from 'react'
import "./job.css"
import compLogo from "../../Assets/netflix.png"
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'


function JobAvl() {

const [searchCategory,setSearchCategory]=useState("");
const [searchLoaction,setSearchLocation]=useState("")
const [jobData,setJobData]=useState([])
const [filterJob,setFilterJob]=useState([])
const [isDivVisible,setDivVisible]=useState(false)
const { t } = useTranslation(['internAndJob']);

useEffect(()=>{
  const fetchData= async()=>{
      try {
      const response= await axios.get("https://backend-internarea-bs4w.onrender.com/api/job")
      setJobData(response.data)
      console.log(response.data)
  } catch (error) {
         console.log(error) 
  }
};
fetchData();
},[]);

  const showDiv=()=>{
  setDivVisible(true)
  }
  const hidediv=()=>{
    setDivVisible(false)
  }

  const handleCategoryChange=(e)=>{
    const categeoryValue=e.target.value;
    setSearchCategory(categeoryValue);
    filterJobs(categeoryValue, searchLoaction);
    //setFilterJob([categeoryValue,searchLoaction])
  }
  
  const handleCategoryLocationChange=(e)=>{
    const loactionValue=e.target.value;
    setSearchLocation(loactionValue);
    filterJobs(searchCategory, loactionValue);
    //setFilterJob([searchCategory,loactionValue])
  }
const filterJobs=(category,location)=>{
  if(jobData && jobData.length >0){
      const filterData=jobData.filter(
        (job)=>{
          const jobCategory = job.category || '';
          const jobLocation = job.location || '';
          return (
              jobCategory.toLowerCase().includes(category.toLowerCase()) &&
              jobLocation.toLowerCase().includes(location.toLowerCase())
          );
        });
        setFilterJob(filterData)
      }
};
useEffect(()=>{
  filterJobs(searchCategory,searchLoaction);
},[searchLoaction,searchCategory,jobData]);


 
  return (
    <>
    <div className='flex internship-filter'>
<div className="first-int mb-14">
  <div className="filter-section w-1/6">
<p className='text-center'><i class="bi bi-funnel  text-blue-400"></i> {t('internAndJob:filter')}</p>
<div className='fill flex flex-col ml-2'>
<label htmlFor="pro">{t('internAndJob:profile')}</label>
<input type="text" id='pro'  value={searchCategory} onChange={handleCategoryChange} className='profile border-2 mr-3 w-full' placeholder='Profile manager'/>
<label htmlFor="loc">{t('internAndJob:location')}</label>
<input type="text" id='loc'  value={searchLoaction}  onChange={handleCategoryLocationChange} className='location border-2  -ml-8 w-full' placeholder='Mumbai'/>
</div>
<div className=" preferences mt-8 flex flex-col">
<div className="flex mt-3 ml-3 mr-3">
  <input type="checkbox" name="wfh" id="whf"  className='mr-2 ml-3'/>
  <label htmlFor="wfh">{t('internAndJob:work_from_home')}</label>
</div>
<div className="flex mt-3 ml-3 mr-3">
<input type="checkbox" name="pt" id="whf"  className='mr-2 ml-3'/>
  <label htmlFor="pt">{t('internAndJob:part_time')}</label>
</div>
<p> {t('internAndJob:annual_salary')}</p>
<input type="range" name="" id="" />
<p className='mt-2 ml-3 mr-3'>0  2K  &nbsp;  4k  &nbsp;  6K &nbsp;  8k   &nbsp; 10K</p>
</div>

<p className= ' mt-5 text-blue-400'>{t('internAndJob:view_more_filters')} <i class="bi bi-chevron-down"></i></p>
<span className='justify-end flex text-blue-400 mr-3'>{t('internAndJob:clear')}</span>
</div>
<div className="search-2"><div className="search-container">
  <label htmlFor="ex ">{t('internAndJob:experince')}</label>
  <input type="text" id='ex' placeholder='eg. 0-1 year' />
  <div className="search-icon">
  <i class="bi bi-search"></i>
  </div>
  </div></div>
  </div>

  <div className="all-internships">
    <div className=" show show2 flex justify-center">
      <p id='filter-ico' className='filterico text-center' >{t('internAndJob:filter')} <i class="bi bi-funnel  text-blue-400" onClick={showDiv}></i>   </p>

    </div>
    <p className='head font-bold text-lg text-center '>{ filterJob.length} {t('internAndJob:total_jobs')}</p>

    { filterJob.map((data,index)=>(

<div className='shadow-lg rounded-lg bg-white m-7 ' id='display'>
  <div className="m-4">
  <p className='mb-4 mt-3' id='boxer'> <i className='bi bi-arrow-up-right text-blue-500' ></i> {t('internAndJob:actively_hiring')}</p>
  <div className="flex justify-end">
<img src={compLogo} className='w-14' alt="" />
  </div>
<div className="all-ele">


<div className='text-lg text-black m-2 mt-7 font-bold'>{data.title}</div>
<div className="info">

<p className='text-sm text-slate-300 font-bold'>{data.company}</p>
<p className=' mt-2'>{data.location}</p>
</div>
<div className="flex text-sm justify-between">
  <p className='mt-3'> <i class="bi bi-play-circle-fill"></i>   {t('internAndJob:start_date')} <br />  {data.StartDate}</p>


  <p className='mt-3'> <i class="bi bi-calendar-check-fill"></i>  {t('internAndJob:experince')}  <br />
  {data.Experience}</p>

  <p className='mt-3'>  <i class="bi bi-cash"></i>   {t('internAndJob:salary')} <br /> {data.CTC}</p>
   </div>
   </div>
   <span className='bg-slate-200 text-slate-400 w-20 rounded-sm text-center'>{t('internAndJob:job')}</span>
   <br />
   <span><i class="bi bi-stopwatch text-green-300"></i>23/11/2065</span>
   <div className="flex justify-end" id='hr'>
<Link className='mt-10' to={`/detailjob?q=${data._id}`}>
<button id='viewButtons' className='bg-transparent text-blue-500'>{t('internAndJob:view_deatils')}</button></Link>
   </div>
  </div>
  </div>
  
    ))
     
    }

  </div>


 
</div>
{
  isDivVisible &&(
    <>
    <div className="first2-int mb-14">
  <div className="filter-section w-1/6">
      <button id='close-btn' onClick={hidediv}><i class=" text-3xl bi bi-x"></i></button>
<p className='text-center'><i class="bi bi-funnel  text-blue-400"></i> {t('internAndJob:filter')}</p>
<div className='fill flex flex-col ml-2'>
<label htmlFor="pro">{t('internAndJob:profile')}</label>
<input type="text" id='pro'  value={searchCategory} onChange={handleCategoryChange} className='profile border-2 mr-3 w-full' placeholder='Profile manager'/>
<label htmlFor="loc">{t('internAndJob:location')}</label>
<input type="text" id='loc'  value={searchLoaction}  onChange={handleCategoryLocationChange} className='location border-2 mt-10  -ml-8 w-full' placeholder='Mumbai'/>
</div>
<div className=" preferences mt-8 flex flex-col">
<div className="flex mt-3 ml-3 mr-3">
  <input type="checkbox" name="wfh" id="whf"  className='mr-2 ml-3'/>
  <label htmlFor="wfh">{t('internAndJob:work_from_home')}</label>
</div>
<div className="flex mt-3 ml-3 mr-3">
<input type="checkbox" name="pt" id="whf"  className='mr-2 ml-3'/>
  <label htmlFor="pt">{t('internAndJob:part_time')}</label>
</div>
<p>{t('internAndJob:annual_salary')}</p>
<input type="range" name="" id="" />
<p className='mt-2 ml-3 mr-3'>0  2K  &nbsp;  4k  &nbsp;  6K &nbsp;  8k   &nbsp; 10K</p>
</div>

<p className= ' mt-5 text-blue-400'>{t('internAndJob:view_more_filters')}<i class="bi bi-chevron-down"></i></p>
<span className='justify-end flex text-blue-400 mr-3'>{t('internAndJob:clear')}</span>
</div>
<div className="search-2"><div className="search-container">
  <label htmlFor="ex ">{t('internAndJob:experince')}</label>
  <input type="text" id='ex' placeholder='eg. 0-1 year' />
  <div className="search-icon">
  <i class="bi bi-search"></i>
  </div>
  </div></div>
  </div>
    </>
  )
}
</>

    
  )
}

export default JobAvl
