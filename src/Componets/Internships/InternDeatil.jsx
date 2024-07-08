import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../Feature/Userslice'
import "./deatil.css"
import axios from 'axios'
import { useTranslation } from 'react-i18next'


function InternDeatil() {
  const user = useSelector(selectUser)
  const [isDivVisible, setDivVisible] = useState(false)
  const [textare, setTextare] = useState("")
  const [company, setCompany] = useState("")
  const [category, setCategory] = useState("")
  const navigate = useNavigate();
  const { t } = useTranslation(['intern_jobDetail'])
  let search = window.location.search;
  const params = new URLSearchParams(search);

  const id = params.get("q")
  const show = () => {
    setDivVisible(true)
  }
  const hide = () => {
    setDivVisible(false)
  }
  const [data, setData] = useState([])
  
  useEffect(()=>{
     const fetchData= async()=>{
    const response=await axios.get(`https://backend-internarea-bs4w.onrender.com/api/internship/${id}`)
    setData(response.data)

    const {company,category}=response.data;
    setCompany(company)
    setCategory(category)
     }
     fetchData()
  })



  const submitApplication = async () => {
    const text = document.getElementById("text")
    if (text.value === "") {
      alert("Fill the mendetory fildes")
    }
    else {
      const bodyJson = {
        coverLetter: textare,
        category: category,
        company: company,
        user: user,
        Application: id
      }

      await axios.post("https://backend-internarea-bs4w.onrender.com/api/application", bodyJson).then((res) => {



      }).catch((err) => {
        alert("error happend")
      })
      alert("Done")
      navigate("/Jobs")
    }
  }
  return (
    <div>

      <div className="details-app">

        <>
          <h1 className='font-bold text-3xl'>{data.title}</h1>
          <div className="m-14 shadow-sm rounded-md border">
            <p className='mb-4 mt-3' id='boxer'> <i className='bi bi-arrow-up-right text-blue-500' ></i> {t('intern_jobDetail:actively_hiring')}</p>
            <div className="main-info align-baseline mr-96 mt-7">


              <p className='text-xl font-bold mt-4'> {data.title}</p>
              <p className='text-sm text-slate-300 font-bold'>{data.title}</p>
              <p> <i class="bi bi-geo-alt-fill"></i> {data.location}</p>
            </div>
            <div className="flex tedxt-sm justify-between">
              <p className='mt-3 text-slate-400'> <i class="bi bi-play-circle-fill"></i>   {t('intern_jobDetail:start_date')}  <br />  {data.StartDate}</p>


              <p className='mt-3 text-slate-400' > <i class="bi bi-calendar-check-fill"></i>  {t('intern_jobDetail:duration')}  <br />
                {data.Duration}</p>

              <p className='mt-3 text-slate-400'>  <i class="bi bi-cash"></i>  {t('intern_jobDetail:stipend')} <br /> {data.stipend}</p>
            </div>
            <div className="flex">
              <p className='bg-green-100 rounded-md ml-4 text-green-300'> <i class="bi bi-clock"></i> 12/12/2012</p>
            </div>
            <hr />
            <div className="aboutCompany flex justify-start">
              <p className='mt-3 text-xl font-bold text-start'> {t('intern_jobDetail:about')} {data.company}</p>
              <br />
            </div>
            <div className="flex">

              <p className='text-blue-500'> {t('intern_jobDetail:instagram')}  <i className='bi bi-arrow-up-right-square'></i></p>

            </div>
            <p className='mt-4'> {data.aboutCompany}</p>
            <div className="about-Job">
              <p className='mt-3 text-xl font-bold text-start'> {t('intern_jobDetail:about_Job')}</p>
              <p>{data.aboutJob}</p>
            </div>
            <p className='text-blue-500 justify-start'> {t('intern_jobDetail:learn_business')}</p>

            <div className="whocan">
              <p className='mt-3 text-xl font-bold text-start'>{t('intern_jobDetail:who_can_apply')}</p>
              <p>{data.Whocanapply}</p>
            </div>

            <p className='mt-3 text-xl font-bold text-start'>{t('intern_jobDetail:perks')}</p>
            <p>{data.perks}</p>

            <p className='mt-3 text-xl font-bold text-start'> {t('intern_jobDetail:additional_information')}</p>
            <p>{data.AdditionalInfo}</p>

            <p className='mt-3 text-xl font-bold text-start'> {t('intern_jobDetail:number_of_opening')}</p>
            <p className='text-start'>{data.numberOfopning}</p>
            <div className='flex justify-center mt-6 bg-blue-500 w-40 text-center text-white font-bold '>
              <button className='flex justify-center align-middle' onClick={show}>{t('intern_jobDetail:apply')}</button>

            </div>

          </div>
        </>



      </div>
      {isDivVisible && (
        <>
          <div className="application-page">
            <div className="bg">
              <button className='close2' onClick={hide} ><i className='bi-bi-x'></i> {t('intern_jobDetail:close')}</button>
              <p>{t('intern_jobDetail:applying_for')}  {data.company}</p>
              <p className='mt-3 text-sm font-bold text-start mb-3'>{data.aboutCompany}</p>

            </div>
            <div className="moreSteps">
              <p className='font-semibold text-xl'>{t('intern_jobDetail:resume')}</p>
              <small>{t('intern_jobDetail:resume_submitted')}</small>

              <p className='mt-5 font-semibold text-xl'>{t('intern_jobDetail:cover_letter')}</p>
              <br />
              <p>{t('intern_jobDetail:question')}</p>
              <textarea name="coverLetter" placeholder='' id="text" value={textare} onChange={(e) => setTextare(e.target.value)}></textarea>
              <p className='mt-5 font-semibold text-xl'>{t('intern_jobDetail:your_availiblity')}</p>
              <p>{t('intern_jobDetail:confirm_your_availiblity')}</p>

            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="Yes, I am available to join immediately"


                />
                {t('intern_jobDetail:immediately')}
              </label>
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  value="No, I am currently on notice period"


                />
                {t('intern_jobDetail:notice_period')}
              </label>
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  value="No, I will have to serve notice period"


                />
                {t('intern_jobDetail:serve_notice_period')}
              </label>
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  value="Other"


                />
                {t('intern_jobDetail:Other')} <span className='text-slate-500'>
                  ({t('intern_jobDetail:specify_availiblity')})  </span>
              </label>
            </div>
            <p className='mt-5 font-semibold text-xl'>{t('intern_jobDetail:custom_resume')} <span className='text-slate-500'>({t('intern_jobDetail:Optional')})</span></p>
            <small className='text-slate-500'>{t('intern_jobDetail:employer_can_download')}</small>


            <div className="submit flex justify-center">
              {user ? (
                <button className='submit-btn' onClick={submitApplication} >{t('intern_jobDetail:submit_application')}</button>
              ) : (
                <Link to={"/register"}>
                  <button className='submit-btn'  >{t('intern_jobDetail:submit_application')}</button>
                </Link>
              )

              }
            </div>
          </div>
        </>
      )

      }
    </div>
  )
}

export default InternDeatil
