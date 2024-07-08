import React, { useState, useEffect, useCallback } from "react";
import Modal from 'react-modal';
//import { auth } from "./firebase/firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

Modal.setAppElement('#root');

const VerificationModal = ({ type, onComplete, newLang }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
 // const [verificationId, setVerificationId] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSendCode = async () => {
    try {
      if (type === 'email') {
        const response = await axios.post('http://localhost:5000/api/send-otp', { email });
        console.log(response.data.message);
      } else {
        const response = await axios.post('http://localhost:5000/api/phoneVerification/send-otp-phone',{ phoneNumber:phone })
        console.log(response.data.message);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  const customStyles = {
    content: {
      display: "flex",
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const handleVerifyCode = async () => {
    try {
      if (type === 'email') {
        const response = await axios.post('http://localhost:5000/api/send-otp/verify-email-otp', {
          email: email,
          otp: verificationCode,
        });
        if (response.status === 200) {
          onComplete();
        } else {
          setError('Invalid OTP');
        }
      } else {
        const response = await axios.post('http://localhost:5000/api/phoneVerification/verify-otp-phone',{
          phoneNumber:phone,
          otp:verificationCode
        })
        if (response.data.success) {
          onComplete();
        } else {
          setError('Invalid OTP');
        }
        alert('Phone number verified successfully.');
        onComplete(newLang);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  }

  return (

    <Modal isOpen={true} onRequestClose={() => onComplete(newLang)} contentLabel="Verification Modal" style={customStyles}>
      <h2>{type === 'email' ? 'Email Verification' : 'Phone Verification'}</h2>
      <div className="w-full p-8">
        {type === 'email' ? (
          <div className="mt-4">
            <label htmlFor="email" className='border-b text-gray-700 text-sm font-bold mb-2'>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className='text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none'
            />
          </div>
        ) : (
          <div className="mt-4">
            <label htmlFor="phone" className='border-b text-gray-700 text-sm font-bold mb-2'>Phone</label>
            <PhoneInput
              country={'us'}
              value={phone}
              onChange={(phone) => {
                setPhone(phone);
                console.log('Phone input value:', phone);
              }
              }
            />
            {/* <div id="recaptcha-container"></div> */}
          </div>
        )}
        <button onClick={handleSendCode}>Send Code</button>
        <div className="mt-4">
          <label htmlFor="phone" className='border-b text-gray-700 text-sm font-bold mb-2'>Verification Code</label>
          <input type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="focus:shadow-outline border border-gray-300 rounded"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="flex">
          <button onClick={handleVerifyCode} className="flex-1">Verify</button>
          <button onClick={onComplete} className="flex-1">Cancel</button>
        </div>

      </div>
    </Modal>

  )
}

export default VerificationModal;