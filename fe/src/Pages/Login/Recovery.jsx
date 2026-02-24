import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from  '../../store/store'
import styles from '../../styles/Username.module.css';
import { generateOTP, verifyOTP } from '../../helper/helper';
import { useNavigate } from 'react-router-dom';

export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate()

  useEffect(() => {
  if (!username || username.trim() === "") {
    toast.error("Username is required for password recovery");
    navigate('/login'); // Redirect back to login
    return;
  }

  generateOTP(username).then((OTP) => {
    console.log(OTP)
    if (OTP) return toast.success('OTP has been sent to your email!');
    return toast.error('Problem while generating OTP!');
  });
}, [username, navigate]);


  async function onSubmit(e){
    e.preventDefault();
    try {
     
      let { status } = await verifyOTP({ username, code : OTP })
      if(status === 201){
        toast.success('Verify Successfully!');
        localStorage.setItem("otpVerified", "true");
        navigate('/reset');
      }  
    } catch (error) {
      return toast.error('Wrong OTP! Check email again!')
    }
    navigate('/reset')

  }

//   // Refactored resendOTP function
// async function resendOTP() {
//   try {
//     // Call generateOTP function to get a new OTP
//     const newOTP = await generateOTP(username);

//     // Display toast message indicating success
//     toast.success('OTP has been sent to your email!');

//     // Log the new OTP value
//     console.log(newOTP);
//   } catch (error) {
//     // Display toast message indicating error
//     toast.error('Could not send OTP. Please try again.');
//   }
// }


  // handler of resend OTP
  function resendOTP(){

    let sentPromise = generateOTP(username);

    toast.promise(sentPromise ,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );
    
  }

  return (
    <div className={styles.container} style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2017/01/09/11/30/dumbbell-1966247_1280.jpg')` }}> {/* Set background image here */}

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Enter OTP to recover password.
            </span>
          </div>

          <form className='pt-20' onSubmit={onSubmit}>

              <div className="textbox flex flex-col items-center gap-6">

                  <div className="input text-center">
                    <span className='py-4 text-sm text-left text-gray-500'>
                      Enter 6 digit OTP sent to your email address.
                    </span>
                    <input onChange={(e) => setOTP(e.target.value) } className={styles.textbox} type="text" placeholder='OTP' />
                  </div>

                  <button className={styles.btn} type='submit'>Recover</button>
              </div>
          </form>

          <div className="text-center py-4">
            <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
          </div>

        </div>
      </div>
    </div>
  )
}