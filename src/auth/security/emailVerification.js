import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import '../authCss/emailVer.css';
import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../logo';
import { Loader } from '../../components/loader';
import { Modal } from '../../components/modal';
import axios from '../../api/axios';

const VERIFY_ACCOUNT_URL = '/auth/verify-email'
const RESEND_CODE_URL = '/auth/request-otp'

export const EmailMsg = () => {
    const codRef = useRef(null);
    const codeRef1 = useRef(null);
    const codeRef2 = useRef(null);
    const codeRef3 = useRef(null);
    const codeRef4 = useRef(null);
    const codeRef5 = useRef(null);
    const buttonRef = useRef(null);
    const [cod, setCod] = useState('');
    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [code3, setCode3] = useState('');
    const [code4, setCode4] = useState('');
    const [code5, setCode5] = useState('');
    const [email, setEmail] = useState('')
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState({});
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(false);
    const [icon, setIcon] = useState(null);
    const [timeState, setTimeState] = useState(false);
    const [time, setTime] = useState(60)

    const maxLength = 1

    const handleCode = (e) => {
        const {name, value} = e.target

        setError({...error, [name]: undefined});
        setCod(name === 'cod' ? value: cod);
        setCode1(name === 'code1' ? value: code1);
        setCode2(name === 'code2' ? value: code2);
        setCode3(name === 'code3' ? value: code3);
        setCode4(name === 'code4' ? value: code4);
        setCode5(name === 'code5' ? value: code5);
    };

    const resendCode = async () => {
        const resBtn = document.getElementById('resnd')
        const email = localStorage.getItem('userEmail').replace(/"|"/g, '')
        const type = 'Email Verification'

        try {

            const resendingInfo = {
                email,
                type
            };

            setLoader(true);

            const res = await axios.post(RESEND_CODE_URL, resendingInfo);

            if(res) {
                setIcon(
                    <div className="success">
                        <svg xmlns="http://www.w3.org/2000/svg" className='fa' viewBox="0 0 100 101" fill="none">
                            <path d="M37.5 50.5L45.8333 58.8333L62.5 42.1667M87.5 50.5C87.5 71.2107 70.7107 88 50 88C29.2893 88 12.5 71.2107 12.5 50.5C12.5 29.7893 29.2893 13 50 13C70.7107 13 87.5 29.7893 87.5 50.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                );

                setMessage('');

                const enableTime = setInterval(() => {
                    setTime(prev => {
                        if(prev > 1){
                            setTimeState(true);
                            resBtn.disabled = true;
                            return prev - 1
                        } else {
                            setTimeState(false);
                            resBtn.disabled = false;
                            clearInterval(enableTime)
                            return 0
                        }
                    });
                }, 2300);

                return () => clearInterval(enableTime);
            }
        } catch (err) {

            if(err) {

                setIcon(
                    <div className="error">
                        <svg className="fa" fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                );

                if(err.response) {
                    const {status} = err.response;
                    if(status === 500){
                        setMessage("Couldn't connect, timeout");
                    };
                }

                if(err.message === "Network Error") {
                    setMessage('Network error, check your network');
                }
            };

            console.error(err)

        } finally {
            setLoader(false);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = {};

        if(!cod) {
            if(codRef.current){
                codRef.current.focus()
            }

        } else {
            const email = localStorage.getItem('userEmail').replace(/"|"/g, '');
            const code = cod + code1 + code2 + code3 + code4 + code5;

            try {
                const data = {
                    email,
                    code
                };

                setLoader(true);

                const res = await axios.post(VERIFY_ACCOUNT_URL, data);

                console.log(data)

                if(res) {
                    setIcon(
                        <div className="success">
                            <svg xmlns="http://www.w3.org/2000/svg" className='fa' viewBox="0 0 100 101" fill="none">
                                <path d="M37.5 50.5L45.8333 58.8333L62.5 42.1667M87.5 50.5C87.5 71.2107 70.7107 88 50 88C29.2893 88 12.5 71.2107 12.5 50.5C12.5 29.7893 29.2893 13 50 13C70.7107 13 87.5 29.7893 87.5 50.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    );

                    
                    localStorage.removeItem('userEmail');
                    setMessage('Verification successful');
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
                        } else if(error.response.data.message === "Your code has either expire or is Invalid"){
                            err.cod = <p className='text-left'>{error.response.data.message}</p>
                        }
                    };
    

                    if(error.message === "Network Error"){
                        setMessage('Network error, check your network');
                    }
                }

                console.error(error)

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
        if(message === 'Verification successful') {
            setMessages(true);        
            
            const Message = setTimeout(() => {
                setMessages(false);
                window.location.href = '/login'
            }, 2200);
    
            return () => clearTimeout(Message);
        }

        if(message === '' || message === 'Network error, check your network' || message === "Couldn't connect, timeout") {
            setMessages(true);        
            
            const Message = setTimeout(() => {
                setMessages(false);
            }, 2200);
    
            return () => clearTimeout(Message);
        }

        document.title = 'Pedxo - Verrify_account'

    }, [loader, message, icon])

    useEffect(() => {
        function checkLength () {
            let num = cod
            let num1 = code1
            let num2 = code2
            let num3 = code3
            let num4 = code4
            let num5 = code5

            if(cod.length > maxLength){
                setCod(num.slice(0, maxLength))
            } else if(cod.length === 1){
                if(codRef.current){
                    codeRef1.current.focus()
                }
            }

            if(code1.length > maxLength){
                setCode1(num1.slice(0, maxLength))
            } else if(code1.length === 1){
                if(codeRef1.current){
                    codeRef2.current.focus()
                }
            }

            if(code2.length > maxLength){
                setCode2(num2.slice(0, maxLength))
            } else if(code2.length === 1){
                if(codeRef2.current){
                    codeRef3.current.focus()
                }
            }

            if(code3.length > maxLength){
                setCode3(num3.slice(0, maxLength))
            } else if(code3.length === 1){
                if(codeRef3.current){
                    codeRef4.current.focus()
                }
            }

            if(code4.length > maxLength){
                setCode4(num4.slice(0, maxLength))
            } else if(code4.length === 1){
                if(codeRef4.current){
                    codeRef5.current.focus()
                }
            }

            if(code5.length > maxLength){
                setCode5(num5.slice(0, maxLength))
            } else if(code5.length === 1){
                if(codeRef5.current){
                    buttonRef.current.focus()
                }
            }
        }

        checkLength()

        return;
    }, [cod, code1, code2, code3, code4, code5])

    useEffect(() => {
        const getEmail = () => {
            const mail = localStorage.getItem('userEmail');
            const mailData = [3, 4, 6, 7, 8, 9, 10, 11, 12]
            const emal = mail.replace(/,/g, (letters, i) => mailData.includes(i) ? '*' : letters)
            setEmail(emal)
        }

        const pageProtected = localStorage.getItem('userEmail');

        if(!pageProtected){
            window.location.href = '/login'
        } else {
            return
        }

        getEmail();
        
        return;
    }, [email])

    return (
        <div className='overflow-hidden emailVer'>
            <div className='sub-emailVer-holder'>
                <div className="d-flex align-items-start justify-content-center emv-pass-hol">
                    <div className="d-inline-flex align-items-start bg-white col-12 sub-emv-pass-hol">
                        <Logo />
                        <div className="col-6 d-flex flex-column justify-content-between align-items-center bg-white in-emv-pass-hol">
                            <div className='d-flex align-items-start col-12 in-sub-emv-pass-hol'>
                                <div className='d-flex flex-column align-items-center gap-4 emv-hol'>
                                    <div className='d-flex flex-column align-items-center align-self-stretch gap-3 emv-pass-hol-text'>
                                        <h2 className='text-capitalize'>Verify your email address</h2>
                                        <p>Enter the 6 digit code that was sent to your email <span>{email}</span> to verify your account.</p>
                                    </div>
                                    <div className='d-flex flex-column align-items-center align-self-stretch gap-2 col-12 emv-pass-hol-form-hol'>
                                        <div className='d-flex flex-column align-items-center gap-2 col-12 bsd'>
                                            <div className='d-flex align-items-center justify-content-between col-12'>
                                                <p>DIdn't get a code</p>
                                                <button id='resnd' className='deb' onClick={() => resendCode()}>{timeState ? `Resend after ${time}s` : `Resend code`}</button>
                                            </div>
                                        </div>
                                        <form className='d-flex flex-column align-items-center align-self-stretch gap-4 col-12 main-form' method='post' autoComplete='off' onSubmit={handleSubmit}>
                                            <div className='d-flex flex-column align-items-center align-self-stretch gap-2 col-12 email-hol'>
                                                <div className='d-flex  align-items-center justify-content-center gap-2 gap-lg-4 gap-sm-3 position-relative col-12 in-ico'>
                                                    <input type='number' name='cod' value={cod} onChange={(e) => handleCode(e)} ref={codRef} maxLength={maxLength} minLength={1}></input>
                                                    <input type='number' name='code1' value={code1} onChange={(e) => handleCode(e)} ref={codeRef1} maxLength={maxLength} minLength={1}></input>
                                                    <input type='number' name='code2' value={code2} onChange={(e) => handleCode(e)} ref={codeRef2} maxLength={maxLength} minLength={1}></input>
                                                    <input type='number' name='code3' value={code3} onChange={(e) => handleCode(e)} ref={codeRef3} maxLength={maxLength} minLength={1}></input>
                                                    <input type='number' name='code4' value={code4} onChange={(e) => handleCode(e)} ref={codeRef4} maxLength={maxLength} minLength={1}></input>
                                                    <input type='number' name='code5' value={code5} onChange={(e) => handleCode(e)} ref={codeRef5} maxLength={maxLength} minLength={1}></input>
                                                </div>
                                                {error.cod}
                                            </div>
                                            <div className='d-flex flex-column-reverse text-center align-slef-stretch gap-4 col-12 emv-pass-hol-form-hol-btn'>
                                                <Link to='/login' className='d-flex flex-column align-items-center align-self-stretch justify-content-center link-hol'>
                                                    <p>Cancel</p>
                                                </Link>
                                                <div className='d-flex flex-column align-items-center align-self-stretch justify-content-center text-capitalize button'>
                                                    <button type='submit' ref={buttonRef}>Verify email address</button>
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