import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import '../authCss/frgPass.css';
import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../logo';
import { Loader } from '../../components/loader';
import { Modal } from '../../components/modal';
import axios from '../../api/axios';

const FORGOT_URL = '/auth/forgot-password'

export const ResetPass = () => {
    const emailRef = useRef(null);
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState({});
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(false);
    const [icon, setIcon] = useState(null)

    const handleEml = (e) => {
        const {name, value} = e.target

        setError({...error, [name]: undefined});
        setEmail(name === 'email' ? value: email);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = {};

        const emil = /[@]/;
        const symbol = /[!#$%^&*]/;
        const space = /\s/g;

        if(!email) {
            err.email = <p>Email required</p>

            if(emailRef.current){
                emailRef.current.focus()
            }

        } else if(!emil.test(email)){

            err.email = <p>Incorrect email must include @</p>

            if(emailRef.current){
                emailRef.current.focus()
            }

        } else if(symbol.test(email)) {

            err.email = <p>Wrong email format</p>

            if(emailRef.current){
                emailRef.current.focus()
            }

        } else if(space.test(email)) {

            err.email = <p>No space allowed</p>

            if(emailRef.current){
                emailRef.current.focus()
            }

        }
        
        if(email) {
            const data = {
                email
            };
            try {
                setLoader(true);

                const res = await axios.post(FORGOT_URL, data);

                if(res) {
                    setIcon(
                        <div className="success">
                            <svg xmlns="http://www.w3.org/2000/svg" className='fa' viewBox="0 0 100 101" fill="none">
                                <path d="M37.5 50.5L45.8333 58.8333L62.5 42.1667M87.5 50.5C87.5 71.2107 70.7107 88 50 88C29.2893 88 12.5 71.2107 12.5 50.5C12.5 29.7893 29.2893 13 50 13C70.7107 13 87.5 29.7893 87.5 50.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    );

                    
                    localStorage.setItem('mail', JSON.stringify(email));
                    setMessage('Successful, please wait');
                    window.location.href = '/reset-password/verify'
                }

            } catch (error) {
                if(error) {
                    setIcon(
                        <div className="error">
                            <svg className="fa" fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                    );

                    if(error.response){
                        const {status} = error.response;
                        if(status === 500 && error.response.data.message === 'Internal server error'){
                            setMessage("Couldn't connect, timeout");
                        } else if(error.response.data.message === 'user is not found'){
                            err.email = <p>User does not exist</p>
                        }
                    };
    

                    if(error.message === "Network Error"){
                        setMessage('Network error, check your network');
                    }
                }

            } finally {
                setLoader(false);
            }
        };

        if (Object.keys(err).length > 0) {
            setError(err);
            return;
        }
    }

    useEffect(() => {
        if(loader) {
            setLoader(true);
        };

        if(message === 'Successful, please wait' || message === 'Network error, check your network' || message === "Couldn't connect, timeout") {
            setMessages(true);        
            
            const Message = setTimeout(() => {
                setMessages(false);
            }, 3000);
    
            return () => clearTimeout(Message);
        }

        document.title = 'Pedxo - Reset_Password'

    }, [loader, message, icon])

    return (
        <div className='overflow-hidden forget'>
            <div className='sub-forget-holder'>
                <div className="d-flex align-items-start justify-content-center frg-pass-hol">
                    <div className="d-inline-flex align-items-start bg-white col-12 sub-frg-pass-hol">
                        <Logo />
                        <div className="col-6 d-flex flex-column justify-content-between align-items-center bg-white in-frg-pass-hol">
                            <div className='d-flex align-items-start col-12 in-sub-frg-pass-hol'>
                                <div className='d-flex flex-column align-items-center gap-4 frg-hol'>
                                    <div className='d-flex flex-column align-items-center align-self-stretch gap-3 frg-pass-hol-text'>
                                        <h2>Forgot password</h2>
                                        <p>Enter the email you used to create your account so we can send you instructions on how to reset your password.</p>
                                    </div>
                                    <div className='col-12 frg-pass-hol-form-hol'>
                                        <form className='d-flex flex-column align-items-center align-self-stretch gap-4 col-12 main-form' method='post' autoComplete='off' onSubmit={handleSubmit}>
                                            <div className='d-flex flex-column align-items-center align-self-stretch gap-2 col-12 email-hol'>
                                                <label>Email Address</label>
                                                <div className='position-relative col-12 in-ico'>
                                                    <input type='email' placeholder='Enter your email' name='email' value={email} onChange={(e) => handleEml(e)} ref={emailRef}></input>
                                                    <div className='fa-holder'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa'>
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8323 17.5C17.6732 17.5 19.1656 16.0076 19.1656 14.1667V6.68557C19.1659 6.67283 19.1659 6.66005 19.1656 6.64725V5.83333C19.1656 3.99238 17.6732 2.5 15.8323 2.5H4.16559C2.32464 2.5 0.832253 3.99238 0.832253 5.83333V6.64726C0.831957 6.66005 0.831958 6.67282 0.832253 6.68556V14.1667C0.832253 16.0076 2.32464 17.5 4.16559 17.5H15.8323ZM2.49892 14.1667C2.49892 15.0871 3.24511 15.8333 4.16559 15.8333H15.8323C16.7527 15.8333 17.4989 15.0871 17.4989 14.1667V7.89753L11.2369 10.4023C10.4422 10.7202 9.55565 10.7202 8.76095 10.4023L2.49892 7.89753V14.1667ZM10.6179 8.85488L17.4989 6.10247V5.83333C17.4989 4.91286 16.7527 4.16667 15.8323 4.16667H4.16559C3.24511 4.16667 2.49892 4.91286 2.49892 5.83333V6.10247L9.37993 8.85488C9.77729 9.01382 10.2206 9.01382 10.6179 8.85488Z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {error.email}
                                            </div>
                                            <div className='d-flex flex-column-reverse text-center align-slef-stretch gap-4 col-12 frg-pass-hol-form-hol-btn'>
                                                <Link to='/login' className='d-flex flex-column align-items-center align-self-stretch justify-content-center link-hol'>
                                                    <p>Cancel</p>
                                                </Link>
                                                <div className='d-flex flex-column align-items-center align-self-stretch justify-content-center button'>
                                                    <button type='submit'>Send Email</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {loader && <Loader />}
                        {messages && <Modal message={message} icon={icon} />}
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    )
}