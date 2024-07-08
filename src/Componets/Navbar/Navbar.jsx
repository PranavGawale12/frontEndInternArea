import React, { useState } from 'react'
import logo from '../../Assets/logo.png'
import { Link } from 'react-router-dom'
import "./navbar.css"
import Sidebar from './Sidebar'
import { signInWithPopup, signOut, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'
import { auth, provider } from '../../firebase/firebase'
import { useSelector } from 'react-redux'
import { selectUser } from '../../Feature/Userslice'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import uaParser from 'ua-parser-js'
import 'react-phone-input-2/lib/style.css'
import axios from 'axios'

const Navbar = ({ onLanguageChange }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    const [isDivVisibleForintern, setDivVisibleForintern] = useState(false)
    const [isDivVisibleForJob, setDivVisibleFroJob] = useState(false)
    const [isDivVisibleForlogin, setDivVisibleFrologin] = useState(false)
    const [isDivVisibleForProfile, setDivVisibleProfile] = useState(false)
    const [isStudent, setStudent] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const { t } = useTranslation(['navbar']);

    const handleLanguageChange = (event) => {
        const newLang = event.target.value;
        i18n.changeLanguage(newLang);
        onLanguageChange(newLang);
    };

    const loginFunction = () => {
        signInWithPopup(auth, provider).then(async (res) => {
            console.log(res)
            const user = res.user;

            const userAgent = navigator.userAgent;
            const parseUA = uaParser(userAgent);
            const browserName = parseUA.browser.name;
            const osName = parseUA.os.name;
            const deviceType = parseUA.device.type || 'desktop';
            const ipAddress = await getIpAddress();

            await axios.post('http://localhost:5000/api/login-history', {
                userId: user.uid,
                browser: browserName,
                os: osName,
                deviceType: deviceType,
                ipAddress: ipAddress,
            });

        }).catch((err) => {
            console.log(err)
        })
        setDivVisibleFrologin(false)
    }

    const getIpAddress = async () => {
        const response = await axios.get('https://api.ipify.org?format=json')
    }

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            const res= await signInWithEmailAndPassword(auth, email, password);
            const user = res.user;

            console.log("Login successful");
            const userAgent = navigator.userAgent;
            const parseUA = uaParser(userAgent);
            const browserName = parseUA.browser.name;
            const osName = parseUA.os.name;
            const deviceType = parseUA.device.type || 'desktop';
            const ipAddress = await getIpAddress();

            await axios.post('http://localhost:5000/api/login-history', {
                userId: user.uid,
                browser: browserName,
                os: osName,
                deviceType: deviceType,
                ipAddress: ipAddress,
            });
            setDivVisibleFrologin(false)
        } catch (error) {
            alert('Login Failed');
        }
    };

    const setupRecaptcha = () => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired, please solve it again.');
            }
        });

    };

    const handlePhoneSignup = (e) => {
        e.preventDefault();
        const recaptchaContainer = document.getElementById('recaptcha-container');
        recaptchaContainer.innerHTML = '';
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        console.log('Phone number:', phone); // Check the value of phone here

        signInWithPhoneNumber(auth, `+${phone}`, appVerifier)
            .then((confirmationResult) => {
                setConfirmationResult(confirmationResult);
                console.log('SMS sent');
            })
            .catch((error) => {
                console.error('Error during phone signup:', error);
            });
    };

    const loginCodeVerify = async (e) => {
        e.preventDefault();
        if (confirmationResult) {
            confirmationResult.confirm(verificationCode)
                .then(async (result) => {
                    const user = result.user;
                    console.log(user);
                    const userAgent = navigator.userAgent;
                    const parseUA = uaParser(userAgent);
                    const browserName = parseUA.browser.name;
                    const osName = parseUA.os.name;
                    const deviceType = parseUA.device.type || 'desktop';
                    const ipAddress = await getIpAddress();

                    await axios.post('http://localhost:5000/api/login-history', {
                        userId: user.uid,
                        browser: browserName,
                        os: osName,
                        deviceType: deviceType,
                        ipAddress: ipAddress,
                    });

                    setDivVisibleFrologin(false)
                })
                .catch((error) => {
                    console.error('Code does not match: ', error);
                })
        }
    };

    const showLogin = () => {
        setDivVisibleFrologin(true)
    }
    const closeLogin = () => {
        setDivVisibleFrologin(false)
    }
    const setTrueForStudent = () => {
        setStudent(false)
    }
    const setFalseForStudent = () => {
        setStudent(true)
    }
    //  for showing profile dropdown
    const showtheProfile = () => {
        setDivVisibleProfile(true)
        document.getElementById("ico3").className = "bi bi-caret-up-fill"
    }
    const hidetheProfile = () => {
        document.getElementById("ico3").className = "bi bi-caret-down-fill"
        setDivVisibleProfile(false)
    }


    const showInternShips = () => {
        document.getElementById("ico").className = "bi bi-caret-up-fill"
        setDivVisibleForintern(true)
    }
    const hideInternShips = () => {
        document.getElementById("ico").className = "bi bi-caret-down-fill"
        setDivVisibleForintern(false)
    }
    const showJobs = () => {
        document.getElementById("ico2").className = "bi bi-caret-up-fill"
        setDivVisibleFroJob(true)
    }
    const hideJobs = () => {
        document.getElementById("ico2").className = "bi bi-caret-down-fill"
        setDivVisibleFroJob(false)
    }

    const logoutFunction = () => {
        signOut(auth)
        navigate("/")
    }

    return (
        <div>

            <nav className='nav1'>
                <ul>
                    <div className="img">
                        <Link to={"/"}><img src={logo} alt="" srcset="" /></Link>
                    </div>
                    <div className="elem">
                        <Link to={"/Internship"}>   <p id='int' className='' onMouseEnter={showInternShips} > {t('navbar:internships')} <i onClick={hideInternShips} id='ico' class="bi bi-caret-down-fill"></i></p></Link>
                        <Link to={"/Jobs"}> <p onMouseEnter={showJobs} >{t('navbar:jobs')}  <i class="bi bi-caret-down-fill" id='ico2' onClick={hideJobs}></i></p></Link>
                    </div>
                    <div className='lang'>
                        <select onChange={handleLanguageChange} value={i18n.language}>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="hi">हिंदी</option>
                            <option value="pt">Português</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>
                    <div className="search">
                        <i class="bi bi-search"></i>
                        <input type="text" placeholder='Search' />
                    </div>
                    {
                        user ? (
                            <>
                                <div className='Profile'>
                                    <Link to={"/profile"}>
                                        <img src={user?.photo} alt="" onMouseEnter={showtheProfile} className='rounded-full w-12' id='picpro' />
                                        <i className='bi bi-caret-up-fill' id='ico3' onClick={hidetheProfile}></i>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="auth">
                                    <button className='btn1' onClick={showLogin}>{t('navbar:login')}</button>


                                    <button className='btn2'><Link to="/register">{t('navbar:register')}</Link></button>
                                </div>
                            </>
                        )


                    }
                    {
                        user ? (
                            <>
                                <button className='bt-log' id='bt' onClick={logoutFunction}>{t('navbar:logout')} <i class="bi bi-box-arrow-right"></i></button>
                            </>
                        ) : (
                            <>
                                <div className="flex mt-7 hire">
                                    {t('navbar:hire_talent')}
                                </div>

                                <div className="admin">
                                    < Link to={"/adminLogin"}>
                                        <button>{t('navbar:admin')}</button>  </Link>
                                </div>
                            </>
                        )
                    }

                </ul>
            </nav>


            {
                isDivVisibleForintern && (
                    <div className="profile-dropdown-2">
                        <div className="left-section">

                            <p>{t('navbar:locations')}</p>
                            <p>{t('navbar:profile')}</p>
                            <p>{t('navbar:category')}</p>
                            <p>{t('navbar:explore')}</p>
                        </div>
                        <div className="line flex bg-slate-400">

                        </div>
                        <div className="right-section">
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                        </div>
                    </div>


                )
            }
            {
                isDivVisibleForJob && (
                    <div className="profile-dropdown-1">
                        <div className="left-section">

                            <p>{t('navbar:locations')}</p>
                            <p>{t('navbar:profile')}</p>
                            <p>{t('navbar:category')}</p>
                            <p>{t('navbar:explore')}</p>
                        </div>
                        <div className="line flex bg-slate-400">

                        </div>
                        <div className="right-section">
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                            <p>{t('navbar:intern_at_india')}</p>
                        </div>
                    </div>


                )
            }
            <div className="login">
                {
                    isDivVisibleForlogin && (
                        <>
                            <button id='cross' onClick={closeLogin}><i class="bi bi-x"></i></button>
                            <h5 id='state' className='mb-4 justify-center text-center'>
                                <span id='Sign-in' style={{ cursor: "pointer" }} className={`auth-tab ${isStudent ? 'active' : ""}`} onClick={setFalseForStudent}>
                                    <p>{t('navbar:student')}</p>
                                </span>
                                &nbsp;     &nbsp; &nbsp;    &nbsp;    &nbsp;    &nbsp;    &nbsp;
                                <span id='join-in' style={{ cursor: "pointer" }} className={`auth-tab ${isStudent ? 'active' : ""}`} onClick={setTrueForStudent}>
                                    <p>{t('navbar:employee')}</p>
                                </span>
                            </h5>
                            {isStudent ? (
                                <>
                                    <div className="py-6">


                                        <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                                            <div className="w-full p-8 lg:w-1/2">
                                                <p onClick={loginFunction} className='flex
 items-center h-9 justify-center mt-4 text-white bg-slate-100 rounded-lg hover:bg-gray-100' >
                                                    <div className="px-4 py-3">
                                                        <svg class="h-6 w-6" viewBox="0 0 40 40">
                                                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                                                            <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                                                            <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                                                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                                                        </svg>
                                                    </div>
                                                    <h4 className='text-gray-500'><p>{t('navbar:login_with_google')}</p>
                                                    </h4>
                                                </p>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className='border-b- w-1/5 lg:w-1/4'></span>
                                                    <p className='text-gray-500 text sm font-bold mb-2'> <p>{t('navbar:or')}</p></p>
                                                    <span className='border-b- w-1/5 lg:w-1/4'></span>

                                                </div>
                                                <form onSubmit={handleEmailLogin}>
                                                    <div class="mt-4">
                                                        <label class="block text-gray-700 text-sm font-bold mb-2">{t('navbar:email')} </label>
                                                        <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email" placeholder='john@example.com' onChange={(e) => setEmail(e.target.value)} />
                                                    </div>
                                                    <div class="mt-4">
                                                        <div class="flex justify-between">
                                                            <label class="block text-gray-700 text-sm font-bold mb-2">{t('navbar:password')}</label>
                                                            <a href="/" class="text-xs text-blue-500">{t('navbar:forget_password')}</a>
                                                        </div>
                                                        <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" placeholder='Must be atleast 6 characters' type="password" onChange={(e) => setPassword(e.target.value)} />
                                                    </div>
                                                    <div className="mt-8">
                                                        <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('navbar:login_with_email')}</button>
                                                    </div>
                                                </form>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className='border-b w-1/5 lg:w1/4'></span>
                                                    <p className='text-xs text-center text-gray-500 uppercase'>{t('navbar:or')}</p>
                                                    <span className='border-b w-1/5 lg:w1/4'></span>
                                                </div>
                                                <form onSubmit={handlePhoneSignup}>
                                                    <div className="mt-4">
                                                        <PhoneInput
                                                            country={'us'}
                                                            value={phone}
                                                            onChange={(phone) => {
                                                                setPhone(phone);
                                                                console.log('Phone input value:', phone);
                                                            }
                                                            }
                                                        />
                                                    </div>
                                                    <div id="recaptcha-container"></div>
                                                    <div className="mt-8">
                                                        <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('navbar:login_with_phone')}</button>
                                                    </div>
                                                </form>
                                                {confirmationResult && (
                                                    <form onSubmit={loginCodeVerify}>
                                                        <div class="mt-4">
                                                            <label class="block text-gray-700 text-sm font-bold mb-2">{t('navbar:verification')}</label>
                                                            <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="text" placeholder='' onChange={(e) => setVerificationCode(e.target.value)} />
                                                        </div>
                                                        <div className="mt-8">
                                                            <button className='btn3  bg-gray-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('navbar:verify')}</button>
                                                        </div>
                                                    </form>
                                                )}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className='text-sm'>{t('navbar:new_register')}(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('navbar:student')}</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('navbar:company')}</span>) </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                                        <div className="w-full p-8 lg:w-1/2">
                                            <form>
                                                <div class="mt-4">
                                                    <label class="block text-gray-700 text-sm font-bold mb-2">{t('navbar:email')} </label>
                                                    <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email" placeholder='john@example.com' onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                                <div class="mt-4">
                                                    <div class="flex justify-between">
                                                        <label class="block text-gray-700 text-sm font-bold mb-2">{t('navbar:password')}</label>
                                                        <a href="/" class="text-xs text-blue-500">{t('navbar:forget_password')}</a>
                                                    </div>
                                                    <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" placeholder='Must be atleast 6 characters' type="password" onChange={(e) => setPassword(e.target.value)} />
                                                </div>
                                                <div className="mt-8">
                                                    <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('navbar:login')}</button>
                                                </div>
                                            </form>
                                            <form>
                                                <div className="mt-4">
                                                    <PhoneInput
                                                        country={'us'}
                                                        value={phone}
                                                        onChange={(phone) => {
                                                            setPhone(phone);
                                                            console.log('Phone input value:', phone);
                                                        }
                                                        }
                                                    />
                                                </div>
                                                <div id="recaptcha-container"></div>
                                                <div className="mt-8">
                                                    <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('navbar:login_with_phone')}</button>
                                                </div>
                                            </form>
                                            {confirmationResult && (
                                                <form onSubmit={loginCodeVerify}>
                                                    <div class="mt-4">
                                                        <label class="block text-gray-700 text-sm font-bold mb-2">{t('navbar:verification')}</label>
                                                        <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="text" placeholder='' onChange={(e) => setVerificationCode(e.target.value)} />
                                                    </div>
                                                    <div className="mt-8">
                                                        <button className='btn3  bg-gray-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('navbar:verify')}</button>
                                                    </div>
                                                </form>
                                            )}
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className='text-sm'>{t('navbar:new_register')}(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('navbar:student')}</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('navbar:company')}</span>) </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                            }
                        </>
                    )
                }
                {isDivVisibleForProfile && (
                    <div className="profile-dropdown h-16 rounded-sm shadow-sm">
                        <p className='font-bold'>{user?.name}</p>
                        <p className='font-medium'>{user?.email}</p>

                    </div>
                )

                }
            </div>
            <Sidebar />
        </div>
    )
};

export default Navbar
