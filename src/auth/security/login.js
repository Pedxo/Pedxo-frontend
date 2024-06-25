import '../authCss/login.css';
import React, { useRef } from 'react';
import { useState, useEffect} from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../logo';
import { Loader } from '../../components/loader';
import { Modal } from '../../components/modal';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/auth';


const LOGIN_URL = '/auth/login';

export const Login = () => {
    const { setData, persist, setPersist } = useAuth();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const [check, setCheck] = useState(false);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(false);
    const [icon, setIcon] = useState(null);
    const [loginText, setLoginText] = useState(null);
    const navigate = useNavigate()
    

    const togglePass = () => {
        setShowPassword(!showPassword);
    };

    const toggleCheck = () => {
        setCheck(!check)
    }

    const handleInput = (e) => {
        const {name, value} = e.target

        setError({ ...error, [name]: undefined});
        setEmail(name === 'email' ? value: email);
        setPassword(name === 'password' ? value: password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErr = {};

        const space = /\s/g;
        const symbol = /[!#$%^&*]/;

        if(!email) {
            newErr.email = <p>Email required</p>

            if(emailRef.current){
                emailRef.current.focus()
            }
        } else if(space.test(email)) {
            newErr.email = <p>space not allowed</p>

            if(emailRef.current){
                emailRef.current.focus()
            }
        } else if(symbol.test(email)) {
            newErr.email = <p>wrong email format</p>

            if(emailRef.current){
                emailRef.current.focus()
            }
        }  else if(!password) {
            newErr.password = <p>Password required</p>

            if(passwordRef.current){
                passwordRef.current.focus()
            }
        } else {
            setPersist(true)
            const userLogins = {
                email,
                password
            };

            try {
                setLoader(true);
                const res = await axios.post(LOGIN_URL, userLogins);
                if(res) {
                    setIcon(
                        <div className="success">
                            <svg xmlns="http://www.w3.org/2000/svg" className='fa' viewBox="0 0 100 101" fill="none">
                                <path d="M37.5 50.5L45.8333 58.8333L62.5 42.1667M87.5 50.5C87.5 71.2107 70.7107 88 50 88C29.2893 88 12.5 71.2107 12.5 50.5C12.5 29.7893 29.2893 13 50 13C70.7107 13 87.5 29.7893 87.5 50.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    );
                    setMessage('Login successfully');
                    const accessToken = res?.data?.accessToken;
                    const userName = res.data.user.userName;
                    const randomToken = res.data.user.randomToken
                    localStorage.setItem('random', randomToken)
    
                    setData({accessToken, userName})
                }
                
            } catch(err) {
                setLoader(false);
                if(err){
                    setIcon(
                        <div className="error">
                            <svg className="fa" fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                    );

                    if(err.response) {
                        const {status} = err.response;

                        if(status === 404 && err.response.data.message === 'user is not found'){
                            newErr.email = <p>User doesn't exist</p>
                        }else if(status === 400 && err.response.data.message === 'You have to verify you account before logging in'){
                            newErr.email = <p>User must be verify before logging</p>

                            const pageProtected = localStorage.getItem('userEmail')
                            
                            if(pageProtected){
                                window.location.href = '/verify-account'
                            }

                        }else if(status === 500 && err.response.data.message === 'Internal server error'){
                            setMessage("Couldn't connect, timeout");
                        } else if(err.response.data.message === 'password do not matched'){
                            newErr.password = <p>Wrong password</p>
                        }
                    }

                    if(err.message === "Network Error"){
                        setMessage('Network error, check your network');
                    }
                }
                
                console.error(err)
            } finally {
                setLoader(false)
            }
        };

        if (Object.keys(newErr).length > 0) {
            setError(newErr);
            return;
        };

    };

    useEffect(() => {
        if( message === 'Login successfully') {
            setMessages(true);        
            
            const Message = setTimeout(() => {
                setMessages(false);
                navigate('/')
            }, 2200);
    
            return () => clearTimeout(Message);
        }

        if(message === 'Network error, check your network' || message === "Couldn't connect, timeout") {
            setMessages(true);        
            
            const Message = setTimeout(() => {
                setMessages(false);
            }, 2200);
    
            return () => clearTimeout(Message);
        }

        const setRem = () => {
            if(check) {
                localStorage.setItem('malic34ius', email)
            } else {
                localStorage.removeItem('mali34cius', email)
            }
        }

        setRem()

        const keepUserRemember = () => {
            const userMail = localStorage.getItem('malic34ius')

            if(userMail) {
                setCheck(true)
                setEmail(userMail)
            } else {
                localStorage.removeItem('malic34ius')
            }
        }

        keepUserRemember()

        const handleResize = () => {
            if (window.innerWidth > 900) {
                setLoginText(<h4>Log In</h4>);
            } else {
                setLoginText(<h4>Welcome back</h4>);
            }
        };

        handleResize();

        document.title = 'Pedxo - Login'

        window.addEventListener('resize', handleResize);

        localStorage.setItem('persist', persist)


        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [message, icon, check, email, persist, navigate]);

    return (
        <div className="overflow-hidden Login">
            <div className='sub-login-holder'>
                <div className='d-flex align-items-start justify-content-center inner-app'>
                    <div className='d-inline-flex align-items-start col-12 bg-white sub-app'>
                        <Logo />
                        <div className='col-6 d-flex flex-column justify-content-between align-items-center form-holder'>
                            <div className='d-flex align-items-start col-12 gap-2 rounded-2 bg-white sub-form-holder'>
                                <div className='d-flex align-items-center flex-column gap-4 col-12 inner-form-holder'>
                                    <div className='d-flex flex-column justify-content-center align-items-start align-self-stretch gap-3 heading'>
                                        <div className='first-text'>
                                            {loginText}
                                        </div>
                                        <div className='second-text'>
                                            <h6>Enter your credentials to access your account</h6>
                                        </div>
                                    </div>
                                    <form method='post' autoComplete='off' onSubmit={handleSubmit} className='d-flex flex-column align-items-start align-self-stretch gap-4 main-form'>
                                        <div className='d-flex flex-column align-items-start align-self-stretch user-input-holder'>
                                            <div className='d-flex flex-column align-items-start align-self-stretch gap-2 email'>
                                                <label>Email</label>
                                                <div className='position-relative col-12 in-ico'>
                                                    <input name='email' value={email} onChange={(e) => handleInput(e)} type='email' placeholder='Enter your email' ref={emailRef}></input>
                                                    <div className='fa-holder'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa'>
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8323 17.5C17.6732 17.5 19.1656 16.0076 19.1656 14.1667V6.68557C19.1659 6.67283 19.1659 6.66005 19.1656 6.64725V5.83333C19.1656 3.99238 17.6732 2.5 15.8323 2.5H4.16559C2.32464 2.5 0.832253 3.99238 0.832253 5.83333V6.64726C0.831957 6.66005 0.831958 6.67282 0.832253 6.68556V14.1667C0.832253 16.0076 2.32464 17.5 4.16559 17.5H15.8323ZM2.49892 14.1667C2.49892 15.0871 3.24511 15.8333 4.16559 15.8333H15.8323C16.7527 15.8333 17.4989 15.0871 17.4989 14.1667V7.89753L11.2369 10.4023C10.4422 10.7202 9.55565 10.7202 8.76095 10.4023L2.49892 7.89753V14.1667ZM10.6179 8.85488L17.4989 6.10247V5.83333C17.4989 4.91286 16.7527 4.16667 15.8323 4.16667H4.16559C3.24511 4.16667 2.49892 4.91286 2.49892 5.83333V6.10247L9.37993 8.85488C9.77729 9.01382 10.2206 9.01382 10.6179 8.85488Z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {error.email}
                                            </div>
                                            <div className='d-flex flex-column align-items-start align-self-stretch gap-2 pass'>
                                                <label>Password</label>
                                                <div className='position-relative col-12 in-ico'>
                                                    <input name='password' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => handleInput(e)} placeholder={showPassword ? 'Enter your password' : '********'} ref={passwordRef}></input>
                                                    <div className='fa-holder'  onClick={togglePass}>
                                                    {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa'>
                                                                        <path d="M2.5 10.8333C5.5 4.16667 14.5 4.16667 17.5 10.8333" stroke="#667185" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                        <path d="M10 14.1667C9.6717 14.1667 9.34661 14.102 9.04329 13.9764C8.73998 13.8507 8.46438 13.6666 8.23223 13.4344C8.00009 13.2023 7.81594 12.9267 7.6903 12.6234C7.56466 12.3201 7.5 11.995 7.5 11.6667C7.5 11.3384 7.56466 11.0133 7.6903 10.71C7.81594 10.4066 8.00009 10.131 8.23223 9.8989C8.46438 9.66675 8.73998 9.4826 9.04329 9.35697C9.34661 9.23133 9.6717 9.16666 10 9.16666C10.663 9.16666 11.2989 9.43006 11.7678 9.8989C12.2366 10.3677 12.5 11.0036 12.5 11.6667C12.5 12.3297 12.2366 12.9656 11.7678 13.4344C11.2989 13.9033 10.663 14.1667 10 14.1667Z" stroke="#667185" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa fa2'>
                                                                                <path d="M17.2544 2.74408C17.5799 3.06951 17.5799 3.59715 17.2544 3.92259L3.92108 17.2559C3.59565 17.5814 3.06801 17.5814 2.74257 17.2559C2.41714 16.9305 2.41714 16.4028 2.74257 16.0774L16.0759 2.74408C16.4013 2.41864 16.929 2.41864 17.2544 2.74408Z"/>
                                                                                <path d="M13.1648 4.4767C12.2262 4.03469 11.1679 3.75 9.99848 3.75C7.54507 3.75 5.5808 5.00308 4.18482 6.33307C2.78563 7.66611 1.87775 9.14973 1.51836 9.7915C1.28284 10.2121 1.25479 10.7143 1.44812 11.1603C1.58313 11.4718 1.81273 11.9544 2.15114 12.5143C2.38919 12.9082 2.90148 13.0346 3.29537 12.7965C3.68927 12.5585 3.81561 12.0462 3.57757 11.6523C3.30538 11.2019 3.1165 10.8124 3.00194 10.5537C3.34007 9.95778 4.14086 8.67693 5.33447 7.53975C6.56736 6.36513 8.14019 5.41667 9.99848 5.41667C10.6669 5.41667 11.2983 5.53937 11.8903 5.75116L13.1648 4.4767Z"/>
                                                                                <path d="M14.7406 7.61491C15.8911 8.73288 16.6643 9.97087 16.995 10.5537C16.8805 10.8124 16.6916 11.2019 16.4194 11.6523C16.1813 12.0462 16.3077 12.5585 16.7016 12.7965C17.0955 13.0346 17.6078 12.9082 17.8458 12.5143C18.1842 11.9544 18.4138 11.4718 18.5488 11.1603C18.7422 10.7143 18.7141 10.2121 18.4786 9.7915C18.1285 9.16625 17.2577 7.74193 15.9192 6.43629L14.7406 7.61491Z"/>
                                                                                <path d="M9.99849 6.66667C10.3013 6.66667 10.5966 6.69898 10.8811 6.76034L9.16628 8.47519C8.45503 8.7262 7.89136 9.28987 7.64035 10.0011L5.9255 11.716C5.86414 11.4315 5.83183 11.1362 5.83183 10.8333C5.83183 8.53215 7.69731 6.66667 9.99849 6.66667Z"/>
                                                                                <path d="M9.99849 13.3333C9.7061 13.3333 9.42543 13.2831 9.16463 13.1909L7.91376 14.4418C8.52693 14.7968 9.23898 15 9.99849 15C12.2997 15 14.1652 13.1345 14.1652 10.8333C14.1652 10.0738 13.9619 9.36177 13.6069 8.74859L12.3561 9.99947C12.4483 10.2603 12.4985 10.5409 12.4985 10.8333C12.4985 12.214 11.3792 13.3333 9.99849 13.3333Z"/>
                                                                            </svg>    
                                                        }
                                                    </div>
                                                </div>
                                                {error.password}
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center align-self-stretch text-hol'>
                                            <div className='d-flex align-items-center gap-2 remem-text'>
                                                <div className={check ? 'd-flex justify-content-center align-items-center align-self-stretch remem click' : 'd-flex justify-content-center align-items-center align-self-stretch remem'} onClick={toggleCheck}>
                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className={check ? 'fa show' : 'fa'} xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                                                    </svg>
                                                </div>
                                                <h4>Remember me</h4>
                                            </div>
                                            <div className='frg-txt'>
                                                <Link to='/reset-password'>Forgot Password?</Link>
                                            </div>
                                        </div>
                                        <div className='d-flex flex-column justify-content-center align-items-center align-self-stretch button-holder'>
                                            <button type='submit'>
                                                <p className='text'>Login</p>
                                            </button>
                                        </div>
                                    </form>
                                    <div className='bottom'>
                                        <div className='d-flex justify-content-center align-items-center gap-2 bottom-text'>
                                            <p>Are you new here?</p>
                                            <a href='/register'>Create account</a>
                                        </div>
                                    </div>
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
};