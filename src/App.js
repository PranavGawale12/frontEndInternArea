import './App.css';
import Footer from './Componets/Footerr/Footer';
import Home from './Componets/Home/Home';
import Navbar from './Componets/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Register from './Componets/auth/Register';
import Intern from "./Componets/Internships/Intern"
import JobAvl from "./Componets/Job/JobAvl"
import JobDetail from './Componets/Job/JobDetail';
import InternDeatil from "./Componets/Internships/InternDeatil"
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from "./Feature/Userslice"
import { useEffect, useState } from 'react';
import { auth } from './firebase/firebase';
import Profile from './profile/Profile';
import AdminLogin from './Admin/AdminLogin';
import Adminpanel from './Admin/Adminpanel';
import ViewAllApplication from "./Admin/ViewAllApplication"
import Postinternships from './Admin/Postinternships';
import DeatilApplication from './Applications/DeatilApplication';
import UserApplicatiom from './profile/UserApplicatiom';
import UserapplicationDetail from "./Applications/DeatilApplicationUser"
import VerificationModal from './VerificationModal';
import PostJob from './Admin/PostJob'
import { useTranslation } from 'react-i18next';
import './i18n';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const [newLang, setNewLang] = useState('en');
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [verificationType, setVerificationType] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(login({

          uid: authUser.uid,
          photo: authUser.photoURL,
          name: authUser.displayName,
          email: authUser.email,
          phoneNumber: authUser.phoneNumber
        }))
      }
      else {
        dispatch(logout())
      }
    })
  }, [dispatch]);

  // useEffect(()=>{
  //   if(!verificationNeeded){
  //     fetchAndTranslateJobs(i18n.language);
  //     fetchAndTranslateInternships(i18n.language);
  //   }
  // },[i18n.language,verificationNeeded]);



  const handleLanguageChange = (lang) => {
    
      setVerificationNeeded(true);
      setVerificationType(lang === 'fr' ? 'email' : 'phone'); // Assuming 'fr' for French
      setNewLang(lang);
      applyLanguageChange(lang);
    
  };

  const handleVerificationComplete = () => {
    setVerificationNeeded(false);
    setVerificationType(null);
    applyLanguageChange(newLang);
  };

  const applyLanguageChange = (lang) => {
    i18n.changeLanguage(newLang);

    switch (lang) {
      case 'hi':
        document.body.className= 'blue-background';
        break;
      case 'zh':
        document.body.className = 'green-background';
        break;
      case 'fr':
        document.body.className = 'yellow-background';
        break;
      default:
        document.body.className = 'white-background';
        break;
    }
  }

  return (
    <div className="App">
      <Navbar onLanguageChange={handleLanguageChange} />
      {verificationNeeded && (
        <VerificationModal
          type={verificationType}
          onComplete={handleVerificationComplete}
          newLang={newLang} />
      )}


      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Internship' element={<Intern />} />
        <Route path='/Jobs' element={<JobAvl />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/detailjob' element={<JobDetail />} />
        <Route path='/detailInternship' element={<InternDeatil />} />
        <Route path='/detailApplication' element={<DeatilApplication />} />
        <Route path='/adminLogin' element={<AdminLogin />} />
        <Route path='/adminepanel' element={<Adminpanel />} />
        <Route path='/postInternship' element={<Postinternships />} />
        <Route path='/postJob' element={<PostJob />} />
        <Route path='/applications' element={<ViewAllApplication />} />
        <Route path='/UserapplicationDetail' element={< UserapplicationDetail />} />
        <Route path='/userapplication' element={<UserApplicatiom />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
