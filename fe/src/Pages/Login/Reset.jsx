// src/pages/Password/Reset.js

import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../../helper/validate';
import { resetPassword } from '../../helper/helper';
import { useAuthStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Username.module.css';

export default function Reset() {
  const { username } = useAuthStore(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const otpVerified = localStorage.getItem("otpVerified");
    if (!otpVerified) {
      toast.error("Access Denied. Please verify OTP first.");
      navigate('/recovery');
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues : {
      password : '',
      confirm_pwd: ''
    },
    validate : resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error : <b>Could not Reset!</b>
      });

      resetPromise.then(() => {
        localStorage.removeItem("otpVerified");
        navigate('/password');
      });
    }
  });

  return (
    <div className={styles.container}>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width : "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter new password.
            </span>
          </div>

          <form className='py-20' onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='New Password' />
              <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type="password" placeholder='Repeat Password' />
              <button className={styles.btn} type='submit'>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
