import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Logo } from '../logo'
import { FaCheck } from 'react-icons/fa';
import { Modal } from '../../components/modal';
import { Loader } from "../../components/loader";
import '../authCss/update.css';
import axios from '../../api/axios';
import { Link, Outlet, useNavigate } from "react-router-dom";

const UPDATE_URL = '/auth/reset-password'

export const UpdatePass = () => {
    const navigate = useNavigate()
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayPassword, setDisplayPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(true);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState('');
    const [valPas, setValPas] = useState({
        lowerCase: false,
        upperCase: false,
        specialCharacters: false,
        numbers: false,
        length: false
    });
    const [valBox, setValBox] = useState(false);
    const [messages, setMessages] = useState(false);
    const [message, setMessage] = useState(null);
    const [icon, setIcon] = useState(null);
    const [loading, setLoading] = useState(false);
 
    const showPass = () => {
        setDisplayPassword(!displayPassword)
    };

    const openPass = () => {
        setOpen(!open)
    };

    const validatePassword = (value) => {
        setValPas({
            lowerCase: /[Link-z]/.test(value),
            upperCase: /[A-Z]/.test(value),
            specialCharacters: /[!@#$%^&*]/.test(value),
            numbers: /[0-9]/.test(value),
            length: value.length >= 8
        });
    };

    const handleUpdate = (e) => {
        const {name, value} = e.target

        setErr({...err, [name]: undefined});
        setPassword(name === 'password' ? value: password);
        setConfirmPassword(name === 'confirmPassword' ? value: confirmPassword);

        if (name === 'password') {
            validatePassword(value)
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        const inpErr = {};

        setSuccess(false)

        if(!password) {

            inpErr.password = <p>password feild required</p>;

            if(passwordRef.current){
                passwordRef.current.focus()
            }

        } else if(!confirmPassword) {

            inpErr.confirmPassword = <p>confirm password feild required</p>;

            if(confirmRef.current){
                confirmRef.current.focus()
            }

        } else if(confirmPassword !== password){

            inpErr.confirmPassword = <p>Password does not match</p>;

            if(confirmRef.current){
                confirmRef.current.focus()
            }

        } else if (!valPas.lowerCase || !valPas.upperCase || !valPas.specialCharacters || !valPas.numbers || !valPas.length) {

            inpErr.password = <p>Incorrect password format </p>;

            if(passwordRef.current){
                passwordRef.current.focus()
            }

            setValBox(false);

        } else if(password && confirmPassword && confirmPassword === password && valPas.lowerCase && valPas.upperCase && valPas.specialCharacters && valPas.numbers && valPas.length){
            const email = localStorage.getItem('mail').replace(/"|"/g, '');

            const newPasswordDetails = {
                email,
                password
            };

            try {

                setLoading(true)

                const res = await axios.patch(UPDATE_URL, newPasswordDetails);

                if(res) {
                    setSuccess(true);
                    setForm(false);
                    localStorage.removeItem('email');
                };

            } catch(err) {
                
                setIcon(
                    <div className="error">
                        <svg className="fa" fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                );

                if(err){
                    if(err.response) {
                        const {status} = err.response;
                        if(status === 500 && err.response.data.message === 'Internal server error'){
                            setMessage("Couldn't connect, timeout");
                        };
                    }

                    if(err.message === "Network Error"){
                        setMessage('Network error, check your network');
                    }
                }
            } finally {
                setLoading(false)
            }
        }


        if(Object.keys(inpErr).length > 0){
            setErr(inpErr);
            return;
        }
    };

    useEffect(() => {
        if(success) {
            setSuccess(true);

            const route = setTimeout(() => {
                window.location.href = '/login'
            }, 3000);

            return () => clearTimeout(route);
        }

        if (document.activeElement === document.getElementById('password')) {
            if (!password || !valPas.lowerCase || !valPas.upperCase || !valPas.specialCharacters || !valPas.numbers || !valPas.length) {
                setValBox(true);
            } else {
                setValBox(false);
            }
        };

        if(message || message === "Couldn't connect, timeout") {
            setMessages(true);

            const rem = setTimeout(() => {
                setMessages(false)
            }, 3000);

            return () => clearTimeout(rem);
        }

        const protect = localStorage.getItem('mail')

        if(!protect) {
            navigate('/login')
        }

        document.title = 'Pedxo - Update_Password'

    }, [password, valPas, success, message, navigate]);

    return (
        <div className="overflow-hidden reset">
            <div className="sub-reset-holder">
                <div className="d-flex align-items-start justify-content-center rst-pas-hol">
                    <div className="d-flex col-12 bg-white in-rst-pas-hol">
                        <Logo />
                        <div className="d-flex flex-column align-items-center justify-content-center col-6 sub-rst-pas-hol">
                            <div className="d-flex align-items-start col-12 bg-white sub-rst-pas-cmp-hol">
                                {form && 
                                    <div className="d-flex flex-column align-items-start in-sub-rst-pas-cmp-hol">
                                        <div className="d-flex flex-column align-items-start align-self-stretch gap-3 heading">
                                            <h4>Reset Password</h4>
                                            <h6>Choose Link new password to your account</h6>
                                        </div>
                                        <div className="col-12 sub-form-holder">
                                            <form className="d-flex flex-column align-items-center align-self-stretch gap-4 form" method="post" onSubmit={handleSubmit}>
                                                <div className="d-flex flex-column align-items-start align-self-stretch gap-3 form-input-holder">
                                                    <div className="d-flex flex-column align-items-start align-self-stretch gap-1 form-inp-1">
                                                        <label>Password</label>
                                                        <div className="position-relative col-12 in-ico">
                                                            <input id="password" name="password" type={displayPassword ? 'text' : 'password'} placeholder={displayPassword ? 'Enter password' : '*********'} value={password} onChange={(e) => handleUpdate(e)} onFocus={() => setValBox(true)} onBlur={() => setValBox(false)}></input>
                                                            <div className="icon" onClick={showPass} ref={passwordRef}>
                                                                { displayPassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa'>
                                                                                        <path d="M2.5 10.8333C5.5 4.16667 14.5 4.16667 17.5 10.8333" stroke="#667185" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                        <path d="M10 14.1667C9.6717 14.1667 9.34661 14.102 9.04329 13.9764C8.73998 13.8507 8.46438 13.6666 8.23223 13.4344C8.00009 13.2023 7.81594 12.9267 7.6903 12.6234C7.56466 12.3201 7.5 11.995 7.5 11.6667C7.5 11.3384 7.56466 11.0133 7.6903 10.71C7.81594 10.4066 8.00009 10.131 8.23223 9.8989C8.46438 9.66675 8.73998 9.4826 9.04329 9.35697C9.34661 9.23133 9.6717 9.16666 10 9.16666C10.663 9.16666 11.2989 9.43006 11.7678 9.8989C12.2366 10.3677 12.5 11.0036 12.5 11.6667C12.5 12.3297 12.2366 12.9656 11.7678 13.4344C11.2989 13.9033 10.663 14.1667 10 14.1667Z" stroke="#667185" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                    </svg>  :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa fa2'>
                                                                                                    <path d="M17.2544 2.74408C17.5799 3.06951 17.5799 3.59715 17.2544 3.92259L3.92108 17.2559C3.59565 17.5814 3.06801 17.5814 2.74257 17.2559C2.41714 16.9305 2.41714 16.4028 2.74257 16.0774L16.0759 2.74408C16.4013 2.41864 16.929 2.41864 17.2544 2.74408Z"/>
                                                                                                    <path d="M13.1648 4.4767C12.2262 4.03469 11.1679 3.75 9.99848 3.75C7.54507 3.75 5.5808 5.00308 4.18482 6.33307C2.78563 7.66611 1.87775 9.14973 1.51836 9.7915C1.28284 10.2121 1.25479 10.7143 1.44812 11.1603C1.58313 11.4718 1.81273 11.9544 2.15114 12.5143C2.38919 12.9082 2.90148 13.0346 3.29537 12.7965C3.68927 12.5585 3.81561 12.0462 3.57757 11.6523C3.30538 11.2019 3.1165 10.8124 3.00194 10.5537C3.34007 9.95778 4.14086 8.67693 5.33447 7.53975C6.56736 6.36513 8.14019 5.41667 9.99848 5.41667C10.6669 5.41667 11.2983 5.53937 11.8903 5.75116L13.1648 4.4767Z"/>
                                                                                                    <path d="M14.7406 7.61491C15.8911 8.73288 16.6643 9.97087 16.995 10.5537C16.8805 10.8124 16.6916 11.2019 16.4194 11.6523C16.1813 12.0462 16.3077 12.5585 16.7016 12.7965C17.0955 13.0346 17.6078 12.9082 17.8458 12.5143C18.1842 11.9544 18.4138 11.4718 18.5488 11.1603C18.7422 10.7143 18.7141 10.2121 18.4786 9.7915C18.1285 9.16625 17.2577 7.74193 15.9192 6.43629L14.7406 7.61491Z"/>
                                                                                                    <path d="M9.99849 6.66667C10.3013 6.66667 10.5966 6.69898 10.8811 6.76034L9.16628 8.47519C8.45503 8.7262 7.89136 9.28987 7.64035 10.0011L5.9255 11.716C5.86414 11.4315 5.83183 11.1362 5.83183 10.8333C5.83183 8.53215 7.69731 6.66667 9.99849 6.66667Z"/>
                                                                                                    <path d="M9.99849 13.3333C9.7061 13.3333 9.42543 13.2831 9.16463 13.1909L7.91376 14.4418C8.52693 14.7968 9.23898 15 9.99849 15C12.2997 15 14.1652 13.1345 14.1652 10.8333C14.1652 10.0738 13.9619 9.36177 13.6069 8.74859L12.3561 9.99947C12.4483 10.2603 12.4985 10.5409 12.4985 10.8333C12.4985 12.214 11.3792 13.3333 9.99849 13.3333Z"/>
                                                                                                </svg>  
                                                                }
                                                            </div>
                                                        </div>
                                                        {err.password}
                                                        <div className={`password-validator-box w-100 p-2 ${valBox ? 'show-box' : 'hide-box'}`}>
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
                                                                    <p>Must be at least Link minimum of 8 characters long</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start align-self-stretch gap-1 form-inp-2">
                                                        <label>Confirm Password</label>
                                                        <div className="position-relative col-12 in-ico">
                                                            <input name="confirmPassword" type={open ? 'text' : 'password'} placeholder={open ? 'Confirm password' : '*********'} value={confirmPassword} onChange={(e) => handleUpdate(e)} ref={confirmRef}></input>
                                                            <div className="icon" onClick={openPass}>
                                                                { open ?   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa'>
                                                                                <path d="M2.5 10.8333C5.5 4.16667 14.5 4.16667 17.5 10.8333" stroke="#667185" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                <path d="M10 14.1667C9.6717 14.1667 9.34661 14.102 9.04329 13.9764C8.73998 13.8507 8.46438 13.6666 8.23223 13.4344C8.00009 13.2023 7.81594 12.9267 7.6903 12.6234C7.56466 12.3201 7.5 11.995 7.5 11.6667C7.5 11.3384 7.56466 11.0133 7.6903 10.71C7.81594 10.4066 8.00009 10.131 8.23223 9.8989C8.46438 9.66675 8.73998 9.4826 9.04329 9.35697C9.34661 9.23133 9.6717 9.16666 10 9.16666C10.663 9.16666 11.2989 9.43006 11.7678 9.8989C12.2366 10.3677 12.5 11.0036 12.5 11.6667C12.5 12.3297 12.2366 12.9656 11.7678 13.4344C11.2989 13.9033 10.663 14.1667 10 14.1667Z" stroke="#667185" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                                            </svg>  :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='fa fa2'>
                                                                                            <path d="M17.2544 2.74408C17.5799 3.06951 17.5799 3.59715 17.2544 3.92259L3.92108 17.2559C3.59565 17.5814 3.06801 17.5814 2.74257 17.2559C2.41714 16.9305 2.41714 16.4028 2.74257 16.0774L16.0759 2.74408C16.4013 2.41864 16.929 2.41864 17.2544 2.74408Z"/>
                                                                                            <path d="M13.1648 4.4767C12.2262 4.03469 11.1679 3.75 9.99848 3.75C7.54507 3.75 5.5808 5.00308 4.18482 6.33307C2.78563 7.66611 1.87775 9.14973 1.51836 9.7915C1.28284 10.2121 1.25479 10.7143 1.44812 11.1603C1.58313 11.4718 1.81273 11.9544 2.15114 12.5143C2.38919 12.9082 2.90148 13.0346 3.29537 12.7965C3.68927 12.5585 3.81561 12.0462 3.57757 11.6523C3.30538 11.2019 3.1165 10.8124 3.00194 10.5537C3.34007 9.95778 4.14086 8.67693 5.33447 7.53975C6.56736 6.36513 8.14019 5.41667 9.99848 5.41667C10.6669 5.41667 11.2983 5.53937 11.8903 5.75116L13.1648 4.4767Z"/>
                                                                                            <path d="M14.7406 7.61491C15.8911 8.73288 16.6643 9.97087 16.995 10.5537C16.8805 10.8124 16.6916 11.2019 16.4194 11.6523C16.1813 12.0462 16.3077 12.5585 16.7016 12.7965C17.0955 13.0346 17.6078 12.9082 17.8458 12.5143C18.1842 11.9544 18.4138 11.4718 18.5488 11.1603C18.7422 10.7143 18.7141 10.2121 18.4786 9.7915C18.1285 9.16625 17.2577 7.74193 15.9192 6.43629L14.7406 7.61491Z"/>
                                                                                            <path d="M9.99849 6.66667C10.3013 6.66667 10.5966 6.69898 10.8811 6.76034L9.16628 8.47519C8.45503 8.7262 7.89136 9.28987 7.64035 10.0011L5.9255 11.716C5.86414 11.4315 5.83183 11.1362 5.83183 10.8333C5.83183 8.53215 7.69731 6.66667 9.99849 6.66667Z"/>
                                                                                            <path d="M9.99849 13.3333C9.7061 13.3333 9.42543 13.2831 9.16463 13.1909L7.91376 14.4418C8.52693 14.7968 9.23898 15 9.99849 15C12.2997 15 14.1652 13.1345 14.1652 10.8333C14.1652 10.0738 13.9619 9.36177 13.6069 8.74859L12.3561 9.99947C12.4483 10.2603 12.4985 10.5409 12.4985 10.8333C12.4985 12.214 11.3792 13.3333 9.99849 13.3333Z"/>
                                                                                        </svg>  
                                                                }
                                                            </div>
                                                        </div>
                                                        {err.confirmPassword}
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column align-items-center justify-content-center align-self-stretch col-12 form-button">
                                                    <button className='d-flex align-items-center justify-content-center col-12' type="submit">
                                                        <p className="text">Change</p>
                                                    </button>
                                                </div>
                                                <div className="d-flex flex-column align-items-center justify-content-center align-self-stretch col-12 link-holder">
                                                    <Link to="/login" className="d-flex align-items-center justify-content-center col-12 link">
                                                        <p className="text">Back to login</p>
                                                    </Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                }
                                {success && 
                                    <div className="d-flex flex-column align-items-center justify-content-center success-hold">
                                        <div className="d-flex align-items-center justify-content-center success">
                                            <svg xmlns="http://www.w3.org/2000/svg" className='fa' viewBox="0 0 100 101" fill="none">
                                                <path d="M37.5 50.5L45.8333 58.8333L62.5 42.1667M87.5 50.5C87.5 71.2107 70.7107 88 50 88C29.2893 88 12.5 71.2107 12.5 50.5C12.5 29.7893 29.2893 13 50 13C70.7107 13 87.5 29.7893 87.5 50.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div className="success-text">
                                            <p>Password reset successfully</p>
                                        </div>
                                    </div>
                                }
                                {loading && <Loader />}
                                {messages &&  <Modal icon={icon} message={message} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    )
}