import '../authCss/register.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa';
import { Logo } from '../logo';
import { Loader } from '../../components/loader';
import { Modal } from '../../components/modal';

const REGISTER_URL = '/auth'

export const SignUp = () => {
    const firstnameref = useRef(null);
    const lastnameref = useRef(null);
    const usernameref = useRef(null);
    const emailref = useRef(null);
    const passwordref = useRef(null);
    const confirmref = useRef(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [check, setCheck] = useState(false);
    const [valPas, setValPas] = useState({
        lowerCase: false,
        upperCase: false,
        specialCharacters: false,
        numbers: false,
        length: false
    });
    const [valBox, setValBox] = useState(false);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(false);
    const [icon, setIcon] = useState(null);
    const [error, setError] = useState({});
    const navigate = useNavigate()

    const togglePass = () => {
        setShowPassword(!showPassword);
    };

    const toggleComPass = () => {
        setShowConfirmPass(!showConfirmPass);
    };

    const checked = () => {
        setCheck(!check)
    }

    const validatePassword = (value) => {
        setValPas({
            lowerCase: /[a-z]/.test(value),
            upperCase: /[A-Z]/.test(value),
            specialCharacters: /[!@#$%^&*]/.test(value),
            numbers: /[0-9]/.test(value),
            length: value.length >= 8
        });
    };

    const handleValue = (e) => {
        const {name, value} = e.target;

        setError({ ...error, [name]: undefined});
        setFirstName(name === 'firstName' ? value: firstName);
        setLastName(name === 'lastName' ? value: lastName);
        setUserName(name === 'userName' ? value: userName);
        setEmail(name === 'email' ? value: email);
        setPassword(name === 'password' ? value: password);
        setConfirmPassword(name === 'confirmPassword' ? value: confirmPassword);

        if (name === 'password') {
            validatePassword(value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};

        const numberRegex = /\d/;
        const symbols = /[!@#$%^&*]/;
        const space = /\s/g;
        const symbol = /[!#$%^&*]/;

        if(!firstName) {
            newError.firstName = <p>First name required</p>

            if(firstnameref.current){
                firstnameref.current.focus()
            }
            
        } else if(space.test(firstName)) {
            newError.firstName = <p>space are not allowed</p>

            if(firstnameref.current){
                firstnameref.current.focus()
            }
            
        } else if(numberRegex.test(firstName) || symbols.test(firstName)) {
            newError.firstName = <p>worng format for first name</p>

            if(firstnameref.current){
                firstnameref.current.focus()
            }
            
        } else if(!lastName) {
            newError.lastName = <p>Last name required</p>

            if(lastnameref.current){
                lastnameref.current.focus()
            }

        } else if(space.test(lastName)) {
            newError.lastName = <p>space are not allowed</p>

            if(lastnameref.current){
                lastnameref.current.focus()
            }
            
        } else if(numberRegex.test(lastName) || symbols.test(lastName)) {
            newError.lastName = <p>worng format for last name</p>

            if(lastnameref.current){
                lastnameref.current.focus()
            }
            
        } else if(!userName) {
            newError.userName = <p>User name required </p>

            if(usernameref.current){
                usernameref.current.focus()
            }

        } else if(space.test(userName)) {
            newError.userName = <p>space are not allowed</p>

            if(usernameref.current){
                usernameref.current.focus()
            }
            
        } else if(numberRegex.test(userName) || symbols.test(userName)) {
            newError.userName = <p>worng format for user name</p>

            if(usernameref.current){
                usernameref.current.focus()
            }
            
        } else if(!email) {
            newError.email = <p>email required </p>

            if(emailref.current){
                emailref.current.focus()
            }

        } else if(space.test(email)) {
            newError.email = <p>space are not allowed</p>

            if(emailref.current){
                emailref.current.focus()
            }
            
        } else if(symbol.test(email)) {
            newError.email = <p>wrong email format</p>

            if(emailref.current){
                emailref.current.focus()
            }
            
        } else if(!password && password !== validatePassword) {
            newError.password = <p>password required </p>

            if(passwordref.current){
                passwordref.current.focus()
            }

        } else if (!valPas.lowerCase || !valPas.upperCase || !valPas.specialCharacters || !valPas.numbers || !valPas.length) {
            newError.password = <p>Incorrect password format </p>
            setValBox(false);

            if(passwordref.current){
                passwordref.current.focus()
            }

        } else if(!confirmPassword) {
            newError.confirmPassword = <p>password required </p>

            if(confirmref.current){
                confirmref.current.focus()
            }

        } else if(password && confirmPassword !== password) {

            newError.confirmPassword = <p>password does not match</p>

            if(confirmref.current){
                confirmref.current.focus()
            }

        } else if (firstName && lastName && userName && email && password && confirmPassword === password && valPas.lowerCase && valPas.upperCase && valPas.specialCharacters && valPas.numbers && valPas.length) {

            const userData = {
                firstName,
                lastName,
                userName,
                email,
                password
            };
            
            try {
                setLoader(true);
                const response = await axios.post(REGISTER_URL, userData);
                if (response) {
                    setIcon(
                        <div className="success">
                            <svg xmlns="http://www.w3.org/2000/svg" className='fa' viewBox="0 0 100 101" fill="none">
                                <path d="M37.5 50.5L45.8333 58.8333L62.5 42.1667M87.5 50.5C87.5 71.2107 70.7107 88 50 88C29.2893 88 12.5 71.2107 12.5 50.5C12.5 29.7893 29.2893 13 50 13C70.7107 13 87.5 29.7893 87.5 50.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    );
                    setMessages(true);
                    setMessage('A verification code have been sent to email');
                    localStorage.setItem('userEmail', email);
                } else {
                    setIcon(
                        <div className="error">
                            <svg className="fa" fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                    );
                    setMessages(true);
                    setMessage('Taking long to load try again');
                }
            } catch (error) {
                setLoader(false);
                if(error) {
                    setIcon(
                        <div className="error">
                            <svg className="fa" fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </div>
                    );

                    if(error.response){
                        const {status} = error.response;

                        if (error.response.data.message === 'email and username already exist' && status === 422) {
                            newError.userName = <p>This user name have already been taken </p>
                            newError.email = <p>Email already taken </p>
                        } else if (error.response.data.message === 'email already exist' && status === 422) {
                            newError.email = <p>Email already exist</p>
                        } else if (error.response.data.message === 'username already exist' && status === 422) {
                            newError.userName = <p>User already exist</p>
                        }if(status === 500 && error.response.data.message === 'Internal server error'){
                            setMessage("Couldn't connect, timeout");
                        };
                    };
    
                    if(error.message === "Network Error"){
                        setMessage('Network error, check your network');
                    }
                }

            } finally {
                setLoader(false)
            }
        }

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }
    };

    
    useEffect(() => {

        if (document.activeElement === document.getElementById('password')) {
            if (!password || !valPas.lowerCase || !valPas.upperCase || !valPas.specialCharacters || !valPas.numbers || !valPas.length) {
                setValBox(true);
            } else {
                setValBox(false);
            }
        };

        if(message  === 'A verification code have been sent to email') {
            setMessages(true);        
            
            const Message = setTimeout(() => {
                setMessages(false);
                navigate('/verify-account');
            }, 2300);
    
            return () => clearTimeout(Message);
        }

        if(message === 'Network error, check your network' || message  === "Couldn't connect, timeout" || message  === 'Taking long to load try again') {
            setMessages(true);        
            
            const Message = setTimeout(() => {
                setMessages(false);
            }, 2300);
    
            return () => clearTimeout(Message);
        }

        document.title = 'Pedxo - Register'

    }, [password, valPas, message, icon, navigate]);

    return (
        <div className="signup">
            <div className='signup-inner-app'>
                <div className='d-flex justify-content-center inner-app'>
                    <div className='d-inline-flex align-items-start col-12 bg-white sub-app'>
                        <Logo />
                        <div className='d-flex flex-column col-6 form-section'>
                            <div className='d-flex align-items-start gap-2 col-12 bg-white form-holder'>
                                <div className='d-flex flex-column align-items-center gap-4 align-self-stretch col-12 inner-form-holder'>
                                    <div className='d-flex flex-column align-items-start justify-content-center align-self-stretch form-title'>
                                        <div className='d-flex flex-column align-items-center gap-3 align-self-stretch title-des'>
                                            <h4>Register</h4>
                                            <span className='login-text'>Already have an account? <Link to='/login'>Login</Link></span>
                                        </div>
                                    </div>
                                    <form method='post' autoComplete='off' onSubmit={handleSubmit} className='d-flex flex-column align-items-start gap-4 align-self-stretch form-input-holder'>
                                        <div className='d-flex flex-column align-items-start gap-4 align-self-stretch inputs'>
                                            <div className='d-flex flex-column align-items-start gap-4 align-self-stretch col-12 name-holder'>
                                                <div className='d-flex flex-column align-items-start gap-2 align-self-stretch fname'>
                                                    <label>First name</label>
                                                    <input name='firstName' type='text' placeholder='enter your first name' value={firstName} onChange={(e) => handleValue(e)} ref={firstnameref}></input>
                                                    {error.firstName}
                                                </div>
                                                <div className='d-flex flex-column align-items-start gap-2 align-self-stretch lname'>
                                                    <label>Last name</label>
                                                    <input name='lastName' type='text' placeholder='enter your last name' value={lastName} onChange={(e) => handleValue(e)} ref={lastnameref}></input>
                                                    {error.lastName}
                                                </div>
                                            </div>
                                            <div className='d-flex flex-column align-items-start gap-4 align-self-stretch col-12 user-email-holder'>
                                                <div className='d-flex flex-column align-items-start gap-2 align-self-stretch uname'>
                                                    <label>User name</label>
                                                    <input name='userName' type='text' placeholder='enter your user name' value={userName} onChange={(e) => handleValue(e)} ref={usernameref}></input>
                                                    {error.userName}
                                                </div>
                                                <div className='d-flex flex-column align-items-start gap-2 align-self-stretch email'>
                                                    <label>Email</label>
                                                    <div className='position-relative col-12 in-ico'>
                                                        <input name='email' type='email' placeholder='enter your email' value={email} onChange={(e) => handleValue(e)} ref={emailref}></input>
                                                        <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 20 20" className='fa'>
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8323 17.5C17.6732 17.5 19.1656 16.0076 19.1656 14.1667V6.68557C19.1659 6.67283 19.1659 6.66005 19.1656 6.64725V5.83333C19.1656 3.99238 17.6732 2.5 15.8323 2.5H4.16559C2.32464 2.5 0.832253 3.99238 0.832253 5.83333V6.64726C0.831957 6.66005 0.831958 6.67282 0.832253 6.68556V14.1667C0.832253 16.0076 2.32464 17.5 4.16559 17.5H15.8323ZM2.49892 14.1667C2.49892 15.0871 3.24511 15.8333 4.16559 15.8333H15.8323C16.7527 15.8333 17.4989 15.0871 17.4989 14.1667V7.89753L11.2369 10.4023C10.4422 10.7202 9.55565 10.7202 8.76095 10.4023L2.49892 7.89753V14.1667ZM10.6179 8.85488L17.4989 6.10247V5.83333C17.4989 4.91286 16.7527 4.16667 15.8323 4.16667H4.16559C3.24511 4.16667 2.49892 4.91286 2.49892 5.83333V6.10247L9.37993 8.85488C9.77729 9.01382 10.2206 9.01382 10.6179 8.85488Z"/>
                                                        </svg>
                                                    </div>
                                                    {error.email}
                                                </div>
                                            </div>
                                            <div className='d-flex flex-column align-items-start gap-4 align-self-stretch col-12 password-confirm-holder'>
                                                <div className='d-flex flex-column align-items-start gap-2 align-self-stretch pass password-holder'>
                                                    <label>Password</label>
                                                    <div className='position-relative col-12 in-ico'>
                                                        <input id='password' name='password' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => handleValue(e)} placeholder={showPassword ? 'Enter your password' : '********'} onFocus={() => setValBox(true)} onBlur={() => setValBox(false)} ref={passwordref}></input>
                                                        <span onClick={togglePass} className='fa-holder'>
                                                            {showPassword ?  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa'>
                                                                                <path d="M2.5 10.8333C5.5 4.16667 14.5 4.16667 17.5 10.8333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                <path d="M10 14.1667C9.6717 14.1667 9.34661 14.102 9.04329 13.9764C8.73998 13.8507 8.46438 13.6666 8.23223 13.4344C8.00009 13.2023 7.81594 12.9267 7.6903 12.6234C7.56466 12.3201 7.5 11.995 7.5 11.6667C7.5 11.3384 7.56466 11.0133 7.6903 10.71C7.81594 10.4066 8.00009 10.131 8.23223 9.8989C8.46438 9.66675 8.73998 9.4826 9.04329 9.35697C9.34661 9.23133 9.6717 9.16666 10 9.16666C10.663 9.16666 11.2989 9.43006 11.7678 9.8989C12.2366 10.3677 12.5 11.0036 12.5 11.6667C12.5 12.3297 12.2366 12.9656 11.7678 13.4344C11.2989 13.9033 10.663 14.1667 10 14.1667Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className='fa'>
                                                                                        <path d="M1.85097 1.85C1.74527 1.95572 1.68098 2.09583 1.66974 2.2449C1.6585 2.39397 1.70107 2.54213 1.78972 2.6625L1.85097 2.73375L5.21347 6.09625C3.57422 7.2449 2.40395 8.94595 1.91722 10.8875C1.88137 11.0468 1.90928 11.2137 1.99495 11.3527C2.08063 11.4917 2.21728 11.5916 2.37568 11.6311C2.53408 11.6706 2.70165 11.6466 2.84256 11.5642C2.98348 11.4817 3.08654 11.3474 3.12972 11.19C3.56193 9.4668 4.62661 7.96927 6.11222 6.995L7.62097 8.50375C7.01575 9.13288 6.68145 9.97431 6.68991 10.8473C6.69836 11.7202 7.04889 12.555 7.66618 13.1723C8.28347 13.7896 9.11827 14.1401 9.99121 14.1486C10.8642 14.157 11.7056 13.8227 12.3347 13.2175L17.2672 18.15C17.3787 18.2611 17.5281 18.326 17.6854 18.3317C17.8427 18.3375 17.9964 18.2837 18.1157 18.1811C18.2351 18.0784 18.3113 17.9346 18.3292 17.7782C18.3471 17.6218 18.3053 17.4644 18.2122 17.3375L18.151 17.2662L13.0572 12.1712V12.17L12.0572 11.1712L9.66597 8.78L7.26722 6.38125L6.32347 5.4375L2.73472 1.85C2.61751 1.73283 2.45857 1.66701 2.29284 1.66701C2.12711 1.66701 1.96817 1.73283 1.85097 1.85ZM8.50471 9.3875L11.4497 12.3337C11.0563 12.7113 10.5307 12.9197 9.98542 12.9141C9.44019 12.9085 8.91887 12.6895 8.53332 12.3039C8.14776 11.9183 7.92869 11.397 7.92311 10.8518C7.91753 10.3066 8.12713 9.78087 8.50471 9.3875ZM10.001 4.58375C9.16722 4.58375 8.35847 4.70625 7.59346 4.9375L8.62472 5.9675C10.4077 5.61432 12.2583 5.95979 13.7938 6.9325C15.3293 7.90521 16.4323 9.43076 16.8747 11.1937C16.9179 11.3512 17.021 11.4855 17.1619 11.5679C17.3028 11.6504 17.4704 11.6744 17.6288 11.6349C17.7872 11.5954 17.9238 11.4954 18.0095 11.3565C18.0952 11.2175 18.1231 11.0505 18.0872 10.8912C17.635 9.08911 16.5938 7.48969 15.1288 6.34694C13.6638 5.20418 11.859 4.58361 10.001 4.58375ZM10.1635 7.50875L13.331 10.675C13.2904 9.84804 12.9436 9.06574 12.3582 8.48029C11.7727 7.89483 10.9904 7.54934 10.1635 7.50875Z" fill="#667185"/>
                                                                                    </svg> 
                                                            }
                                                        </span>
                                                    </div>
                                                    {error.password}
                                                    <div className={`p-1 col-12 password-validator-box ${valBox ? 'show-box' : 'hide-box'}`}>
                                                        <div className='d-flex flex-column align-items-start gap-2 inner-validator-box'>
                                                            <div className={`d-flex align-items-center gap-1 validator1 ${valPas.upperCase && valPas.lowerCase  ? 'right' : 'wrong'}`}>
                                                                <FaCheck className={`fa ${valPas.upperCase && valPas.lowerCase ? 'show' : 'hide'}`} />
                                                                <p>Must contain one uppercase and lowercase Aa-Zz</p>
                                                            </div>
                                                            <div className={`d-flex align-items-center gap-1 validator1 ${valPas.specialCharacters && valPas.numbers  ? 'right' : 'wrong'}`}>
                                                                <FaCheck className={`fa ${valPas.specialCharacters && valPas.numbers  ? 'show' : 'hide'}`} />
                                                                <p>Must contain one sepcial characters(@-$) and numbers(0-9)</p>
                                                            </div>
                                                            <div className={`d-flex align-items-center gap-1 validator1 ${valPas.length ? 'right' : 'wrong'}`}>
                                                                <FaCheck className={`fa ${valPas.length ? 'show' : 'hide'}`} />
                                                                <p>Must be at least a minimum of 8 characters long</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='d-flex flex-column align-items-start gap-2 align-self-stretch pass'>
                                                    <label>Confirm Password</label>
                                                    <div className='position-relative col-12 in-ico'>
                                                        <input name='confirmPassword' type={showConfirmPass ? 'text' : 'password'} value={confirmPassword} onChange={(e) => handleValue(e)} placeholder={showConfirmPass ? 'Enter your password' : '********'} ref={confirmref}></input>
                                                        <span onClick={toggleComPass} className='fa-holder'>
                                                            {showConfirmPass ?  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa'>
                                                                                <path d="M2.5 10.8333C5.5 4.16667 14.5 4.16667 17.5 10.8333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                <path d="M10 14.1667C9.6717 14.1667 9.34661 14.102 9.04329 13.9764C8.73998 13.8507 8.46438 13.6666 8.23223 13.4344C8.00009 13.2023 7.81594 12.9267 7.6903 12.6234C7.56466 12.3201 7.5 11.995 7.5 11.6667C7.5 11.3384 7.56466 11.0133 7.6903 10.71C7.81594 10.4066 8.00009 10.131 8.23223 9.8989C8.46438 9.66675 8.73998 9.4826 9.04329 9.35697C9.34661 9.23133 9.6717 9.16666 10 9.16666C10.663 9.16666 11.2989 9.43006 11.7678 9.8989C12.2366 10.3677 12.5 11.0036 12.5 11.6667C12.5 12.3297 12.2366 12.9656 11.7678 13.4344C11.2989 13.9033 10.663 14.1667 10 14.1667Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className='fa'>
                                                                                        <path d="M1.85097 1.85C1.74527 1.95572 1.68098 2.09583 1.66974 2.2449C1.6585 2.39397 1.70107 2.54213 1.78972 2.6625L1.85097 2.73375L5.21347 6.09625C3.57422 7.2449 2.40395 8.94595 1.91722 10.8875C1.88137 11.0468 1.90928 11.2137 1.99495 11.3527C2.08063 11.4917 2.21728 11.5916 2.37568 11.6311C2.53408 11.6706 2.70165 11.6466 2.84256 11.5642C2.98348 11.4817 3.08654 11.3474 3.12972 11.19C3.56193 9.4668 4.62661 7.96927 6.11222 6.995L7.62097 8.50375C7.01575 9.13288 6.68145 9.97431 6.68991 10.8473C6.69836 11.7202 7.04889 12.555 7.66618 13.1723C8.28347 13.7896 9.11827 14.1401 9.99121 14.1486C10.8642 14.157 11.7056 13.8227 12.3347 13.2175L17.2672 18.15C17.3787 18.2611 17.5281 18.326 17.6854 18.3317C17.8427 18.3375 17.9964 18.2837 18.1157 18.1811C18.2351 18.0784 18.3113 17.9346 18.3292 17.7782C18.3471 17.6218 18.3053 17.4644 18.2122 17.3375L18.151 17.2662L13.0572 12.1712V12.17L12.0572 11.1712L9.66597 8.78L7.26722 6.38125L6.32347 5.4375L2.73472 1.85C2.61751 1.73283 2.45857 1.66701 2.29284 1.66701C2.12711 1.66701 1.96817 1.73283 1.85097 1.85ZM8.50471 9.3875L11.4497 12.3337C11.0563 12.7113 10.5307 12.9197 9.98542 12.9141C9.44019 12.9085 8.91887 12.6895 8.53332 12.3039C8.14776 11.9183 7.92869 11.397 7.92311 10.8518C7.91753 10.3066 8.12713 9.78087 8.50471 9.3875ZM10.001 4.58375C9.16722 4.58375 8.35847 4.70625 7.59346 4.9375L8.62472 5.9675C10.4077 5.61432 12.2583 5.95979 13.7938 6.9325C15.3293 7.90521 16.4323 9.43076 16.8747 11.1937C16.9179 11.3512 17.021 11.4855 17.1619 11.5679C17.3028 11.6504 17.4704 11.6744 17.6288 11.6349C17.7872 11.5954 17.9238 11.4954 18.0095 11.3565C18.0952 11.2175 18.1231 11.0505 18.0872 10.8912C17.635 9.08911 16.5938 7.48969 15.1288 6.34694C13.6638 5.20418 11.859 4.58361 10.001 4.58375ZM10.1635 7.50875L13.331 10.675C13.2904 9.84804 12.9436 9.06574 12.3582 8.48029C11.7727 7.89483 10.9904 7.54934 10.1635 7.50875Z" fill="#667185"/>
                                                                                    </svg> 
                                                            }
                                                        </span>
                                                    </div>
                                                    {error.confirmPassword}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex flex-column align-items-start gap-4 align-self-stretch col-12 button-holder'>
                                            <div className='d-flex align-items-center gap-2 align-self-stretch newsl'>
                                                <div className={check ? 'd-flex align-items-center justify-content-center align-self-stretch checkbox click' : 'd-flex align-items-center justify-content-center align-self-stretch checkbox'} onClick={checked}>
                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className={check ? 'fa show' : 'fa'} xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                                                    </svg>
                                                </div>
                                                <p>Yes, I want to receive newsletters from Pedxo</p>
                                            </div>
                                            <div className='d-flex flex-column align-items-center justify-content-center align-self-stretch gap-2 col-12 rounded-2 py-3 px-4 button'>
                                                <button className='d-flex align-items-center justify-content-center bg-transparent gap-2 col-12' type='submit'>
                                                    <p className='text'>Create account</p>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {loader && <Loader />}
                {messages && <Modal message={message} icon={icon} />}
            </div>

            <Outlet />
        </div>
    )
}