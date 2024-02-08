import '../authCss/login.css';
import React, { useState } from 'react';
import logo from '../../Img/pedxo_2.png';
import { FaFacebookF } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Login = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePass = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="Login">
            <div>
                <div className='inner-app'>
                    <div className='sub-app'>
                        <div className='Logo-media-holder'>
                            <div className='logo d-flex justify-content-center'>
                            <div className='inner-logo'>
                                <img className='img-fluid' src={logo} alt=''></img>
                            </div>
                            </div>
                            <div className='media-han'>
                                <a className='icon' href='https://twitter.com/Pedxodotcom'><FaTwitter /></a>
                                <a className='icon' href='https://web.facebook.com/people/Pedxo/100090410366859'><FaFacebookF /></a>
                                <a className='icon' href='https://www.linkedin.com/company/pedxo'><FaLinkedinIn /></a>
                            </div>
                        </div>
                        <div className='form-holder'>
                            <div className='heading d-flex w-100 justify-content-center h-5'>
                                <div className='logo head'>
                                    <h2 className=''>Login</h2>
                                </div>
                            </div>
                            <form method='' action=''>
                                <div className='user-input-holder'>
                                    <div className='email'>
                                        <label>Email</label>
                                        <input name='email' type='email' placeholder='email'></input>
                                    </div>
                                    <div className='pass'>
                                        <label>Password</label>
                                        <input name='pass' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='********'></input>
                                        <div className='togglebtn'>
                                            <button type='button' onClick={togglePass}>{showPassword ? <FaEye /> : <FaEyeSlash /> }</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-hol'>
                                    <div className='frg-txt'>
                                        <a href='loh/'>Forgotten password</a>
                                    </div>
                                    <div className='sign-text'>
                                        <p>Don't have an account yet?</p>
                                        <a href='loh/'>Register</a>
                                    </div>
                                </div>
                                <div className='button'>
                                    <button type='submit'>Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}