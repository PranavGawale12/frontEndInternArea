import React, { useState } from 'react'
import { signInWithPopup, createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, updateProfile, signInWithEmailAndPassword } from 'firebase/auth'
import './register.css'
import { auth, provider, phoneProvider } from "../../firebase/firebase"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import uaParser from 'ua-parser-js'
import axios from 'axios'
import 'react-phone-input-2/lib/style.css'

function Register() {
  const [isStudent, setStudent] = useState(true)
  const [isDivVisible, setDivVisible] = useState(false)
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const { t } = useTranslation(['register']);


  let navigate = useNavigate()

  const handleSignin = async () => {

    await signInWithPopup(auth, provider).then(async (res) => {
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

      navigate("/")
    }).catch((err) => {
      console.log(err)
    })
    toast("Login Success")
  }

  const getIpAddress = async () => {
    const response = await axios.get('https://api.ipify.org?format=json')
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const fullName = `${fname} ${lname}`;
      await updateProfile(user, {
        displayName: fullName
      });
      console.log(user);
      showLogin();
      navigate("/register");
    } catch (error) {
      alert("Signup Failed");
    }

  }


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

  const verifyCode = (e) => {
    e.preventDefault();
    if (confirmationResult) {
      confirmationResult.confirm(verificationCode)
        .then((result) => {
          const user = result.user;
          const displayName = `${fname} ${lname}`;
          updateProfile(user, { displayName })
            .then(() => {
              console.log('Profile updated');
              showLogin();
              navigate("/register");
              setConfirmationResult(null);
            })
            .catch((error) => {
              console.error('Error updating profile:', error);
            });
        })
        .catch((error) => {
          console.error('Error verifying code:', error);
        });
    } else {
      console.error('No confirmation result available');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      const user = response.user;

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

      navigate("/");
    } catch (error) {
      alert('Login Failed');
    }
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
          navigate("/");
          const recaptchaContainer = document.getElementById('recaptcha-container');
          recaptchaContainer.innerHTML = '';
        })
    }
  };

  const setTrueForStudent = () => {
    setStudent(false)
  }

  const setFalseForStudent = () => {
    setStudent(true)
  }

  const showLogin = () => {
    setDivVisible(true)
  }

  const closeLogin = () => {
    setDivVisible(false)

  }
  return (
    <div>
      <div className="form">
        <h1>{t('register:signup')}</h1>
        <p className='para3'>{t('register:companies_hiring')}</p>
        <div className="regi">
          <div className="py-6">
            <div className="flex bg-white rounded-lg justify-center shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
              <div className="w-full p-8 lg:w-1/2">
                <a onClick={handleSignin} class="flex items-center h-9 justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
                  <div class="px-4 py-3 cursor-pointer">
                    <svg class="h-6 w-6" viewBox="0 0 40 40">
                      <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                      <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                      <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                      <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                    </svg>
                  </div>
                  <h1 class="cursor-pointer px-4 py-3 w-5/6 text-center text-xl text-gray-600 font-bold">{t('register:signin_with_google')}</h1>

                </a>
                <div className="mt-4 flex items-center justify-between">
                  <span className='border-b w-1/5 lg:w1/4'></span>
                  <p className='text-xs text-center text-gray-500 uppercase'>{t('register:or')}</p>
                  <span className='border-b w-1/5 lg:w1/4'></span>
                </div>
                <form onSubmit={handleEmailSignup}>
                  <div className="mt-4">
                    <label htmlFor="email" className='border-b text-gray-700 text-sm font-bold mb-2'>{t('register:email')}</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none' id='email' />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="password" className='border-b text-gray-700 text-sm font-bold mb-2'>{t('register:password')}</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className='text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none' id='password' />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <label htmlFor="Fname" className='border-b text-gray-700 text-sm font-bold mb-2'>{t('register:fname')}</label>
                      <input type="text" className='text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none' id='Fname' value={fname} onChange={(e) => setFname(e.target.value)} />
                    </div>
                    <div className='ml-5'>
                      <label htmlFor="Lname" className='border-b text-gray-700 text-sm font-bold mb-2'>{t('register:lname')}</label>
                      <input type="text" className='text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none' id='Lname' value={lname} onChange={(e) => setLname(e.target.value)} />
                    </div>
                  </div>
                  <button type="submit" className='bg-blue-500 h-9 text-white font-bold py-2 mt-4 px-4 w-full rounded hover:bg-blue-600'>{t('register:signup_with_email')}</button>
                </form>
                <div className="mt-4 flex items-center justify-between">
                  <span className='border-b w-1/5 lg:w1/4'></span>
                  <p className='text-xs text-center text-gray-500 uppercase'>{t('register:or')}</p>
                  <span className='border-b w-1/5 lg:w1/4'></span>
                </div>
                <form onSubmit={handlePhoneSignup}>
                  {/* <div className="mt-4">
                    <label htmlFor="phone" className='border-b text-gray-700 text-sm font-bold mb-2'>Pnone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className='text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none' id='phone' />
                  </div> */}
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
                  <button type="submit" className='bg-blue-500 h-9 text-white font-bold py-2 mt-4 px-4 w-full rounded hover:bg-blue-600'>{t('register:signup_with_phone')}</button>
                </form>
                {
                  confirmationResult && (
                    <form onSubmit={verifyCode}>
                      <div className="mt-4">
                        <label htmlFor="verificationCode" className='border-b text-gray-700 text-sm font-bold mb-2'>{t('register:verification')}</label>
                        <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className='text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none' id='verificationCode' />
                      </div>
                      <button type="submit" className='bg-gray-500 h-9 text-white font-bold py-2 mt-4 px-4 w-full rounded hover:bg-blue-600'>{t('register:verify')}</button>
                    </form>
                  )
                }

                <small>{t('register:agree')} <span className='text-blue-400'>{t('register:terms')}
                </span>
                  {t('register:already_registered')}? </small><span className='text-blue-400 cursor-pointer' onClick={showLogin}>{t('register:login')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="login">
        {
          isDivVisible && (
            <>
              <button id='cross' onClick={closeLogin}><i class="bi bi-x"></i></button>
              <h5 id='state' className='mb-4 justify-center text-center'>
                <span id='Sign-in' style={{ cursor: "pointer" }} className={`auth-tab ${isStudent ? 'active' : ""}`} onClick={setFalseForStudent}>
                  {t('register:student')}
                </span>
                &nbsp;     &nbsp; &nbsp;    &nbsp;    &nbsp;    &nbsp;    &nbsp;
                <span id='join-in' style={{ cursor: "pointer" }} className={`auth-tab ${isStudent ? 'active' : ""}`} onClick={setTrueForStudent}>
                  {t('register:employee')}
                </span>
              </h5>
              {isStudent ? (
                <>
                  <div className="py-6">


                    <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                      <div className="w-full p-8 lg:w-1/2">
                        <p onClick={handleSignin} className='flex
 items-center h-9 justify-center mt-4 text-white bg-slate-100 rounded-lg hover:bg-gray-100' >
                          <div className="px-4 py-3">
                            <svg class="h-6 w-6" viewBox="0 0 40 40">
                              <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                              <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                              <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                              <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                            </svg>
                          </div>
                          <h1 class="cursor-pointer px-4 py-3 w-5/6 text-center text-sm text-gray-600 font-bold">{t('register:login_with_google')}</h1>
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className='border-b w-1/5 lg:w1/4'></span>
                          <p className='text-xs text-center text-gray-500 uppercase'>{t('register:or')}</p>
                          <span className='border-b w-1/5 lg:w1/4'></span>
                        </div>
                        <form onSubmit={handleEmailLogin}>
                          <div class="mt-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">{t('register:email')}</label>
                            <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email" placeholder='john@example.com' onChange={(e) => setEmail(e.target.value)} />
                          </div>
                          <div class="mt-4">
                            <div class="flex justify-between">
                              <label class="block text-gray-700 text-sm font-bold mb-2">{t('register:password')}</label>
                              <a href="/" class="text-xs text-blue-500">{t('register:forget_password')}</a>
                            </div>
                            <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" placeholder='Must be atleast 6 characters' type="password" onChange={(e) => setPassword(e.target.value)} />
                          </div>
                          <div className="mt-8">
                            <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('register:login_with_email')}</button>
                          </div>
                        </form>
                        <div className="mt-4 flex items-center justify-between">
                          <span className='border-b w-1/5 lg:w1/4'></span>
                          <p className='text-xs text-center text-gray-500 uppercase'>{t('register:or')}</p>
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
                          <div className="mt-8">
                            <div id="recaptcha-container"></div>
                            <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('register:login_with_phone')}</button>
                          </div>
                        </form>
                        {
                          confirmationResult && (
                            <form onSubmit={loginCodeVerify}>
                              <div class="mt-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">{t('register:verification')}</label>
                                <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="text" placeholder='' onChange={(e) => setVerificationCode(e.target.value)} />
                              </div>
                              <div className="mt-8">
                                <button className='btn3  bg-gray-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('register:verify')}</button>
                              </div>
                            </form>
                          )
                        }
                        <div className="mt-4 flex items-center justify-between">
                          <p className='text-sm'>{t('register:new_register')}(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('register:student')}</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('register:company')}</span>) </p>
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
                          <label class="block text-gray-700 text-sm font-bold mb-2">{t('register:email')}</label>
                          <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email" placeholder='john@example.com' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div class="mt-4">
                          <div class="flex justify-between">
                            <label class="block text-gray-700 text-sm font-bold mb-2">{t('register:password')}</label>
                            <a href="/" class="text-xs text-blue-500">{t('register:forget_password')}</a>
                          </div>
                          <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" placeholder='Must be atleast 6 characters' type="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mt-8">
                          <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('register:login')}</button>
                        </div>
                      </form>
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
                        <div className="mt-8">
                          <div id="recaptcha-container"></div>
                          <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('register:login_with_phone')}</button>
                        </div>
                      </form>
                      {confirmationResult && (
                        <form onSubmit={loginCodeVerify}>
                          <div class="mt-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">{t('register:verification')}</label>
                            <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="text" placeholder='' onChange={(e) => setVerificationCode(e.target.value)} />
                          </div>
                          <div className="mt-8">
                            <button className='btn3  bg-gray-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ' type='submit'>{t('register:verify')}</button>
                          </div>
                        </form>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <p className='text-sm'>{t('register:new_register')}(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('register:student')}</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>{t('register:company')}</span>) </p>
                      </div>
                    </div>
                  </div>
                </>
              )
              }
            </>
          )
        }
      </div>
    </div>
  )
}

export default Register;
