import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import './css/header.css';
import AuthInfo from '../provider/authData';
import { useAuth } from '../hooks/auth';
import { Link, Outlet } from "react-router-dom";
import user from  '../Img/user.png';

export const Header = () => {
    const [openServices, setOpenServices] = useState(false);
    const [openResources, setOpenResources] = useState(false);
    const [loginServices, setLoginService] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [nav, setNav] = useState(false);
    const [menu, setMenu] = useState(null);
    const [mobileLogo, setMobileLogo] = useState(null);
    const [homeLink, setHomeLink] = useState(null);
    const { data } = useContext(AuthInfo);
    const { setData } = useAuth()
    const [tokHol, setTokHol] = useState(null)
    const [image, setImage] = useState(null)

    const showNav = () => {
        setNav(true);
        document.body.style.overflow = 'hidden'
    };

    const closeNav = () => {
        setNav(false);
        document.body.style.overflow = 'auto';
    };
    const toggleServices = () => {
        setOpenServices(!openServices);
        setOpenResources(false); // Close the other dropdown when this one is opened
    };

    const toggleResources = () => {
        setOpenResources(!openResources);
        setOpenServices(false); // Close the other dropdown when this one is opened
    };
    const loginToggleServices = () => {
        setLoginService(!loginServices)
    };

    const logout = () => {
        setData({})
        localStorage.removeItem('random')
        localStorage.removeItem('persist')
    }

    useEffect(() => {
        const handleScroll = () => {
            if(window.pageYOffset > 0){
                setScroll(true)
            } else {
                setScroll(false)
            }
        };

        const addMenu = () => {
            if(window.innerWidth > 992) {
                setMenu(null);
                setMobileLogo(null);
                setHomeLink(null);
                return
            } else {
                setMenu(
                    <div className='d-flex align-items-start flex-column justify-content-left toggle-bar' onClick={() => showNav()}>
                        <div className='bar'></div>
                        <div className='bar bar-2'></div>
                        <div className='bar bar-3'></div>
                    </div>
                );
                setMobileLogo(
                    <div className="d-flex align-items-center col-12 justify-content-between inner-logo">
                        <div className="lgo">
                            <h4>Pedxo</h4>
                        </div>
                        <div onClick={() => closeNav()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 18 18" fill="none">
                                <path d="M0.494492 0.494492C0.651027 0.337733 0.83693 0.213373 1.04157 0.128524C1.24621 0.0436741 1.46557 0 1.6871 0C1.90863 0 2.12799 0.0436741 2.33263 0.128524C2.53727 0.213373 2.72317 0.337733 2.8797 0.494492L9.00025 6.61279L15.1208 0.494492C15.2774 0.337876 15.4633 0.213642 15.668 0.128882C15.8726 0.0441229 16.0919 0.000497867 16.3134 0.000497862C16.5349 0.000497858 16.7542 0.0441229 16.9588 0.128882C17.1635 0.213642 17.3494 0.337876 17.506 0.494492C17.6626 0.651107 17.7869 0.837036 17.8716 1.04166C17.9564 1.24629 18 1.46561 18 1.6871C18 1.90859 17.9564 2.1279 17.8716 2.33253C17.7869 2.53716 17.6626 2.72309 17.506 2.8797L11.3877 9.00025L17.506 15.1208C17.8223 15.4371 18 15.8661 18 16.3134C18 16.7607 17.8223 17.1897 17.506 17.506C17.1897 17.8223 16.7607 18 16.3134 18C15.8661 18 15.4371 17.8223 15.1208 17.506L9.00025 11.3877L2.8797 17.506C2.5634 17.8223 2.13441 18 1.6871 18C1.23978 18 0.81079 17.8223 0.494492 17.506C0.178193 17.1897 0.000497862 16.7607 0.000497862 16.3134C0.000497862 15.8661 0.178193 15.4371 0.494492 15.1208L6.61279 9.00025L0.494492 2.8797C0.337733 2.72317 0.213373 2.53727 0.128524 2.33263C0.0436741 2.12799 0 1.90863 0 1.6871C0 1.46557 0.0436741 1.24621 0.128524 1.04157C0.213373 0.83693 0.337733 0.651027 0.494492 0.494492Z" fill="#F0F1F3"/>
                            </svg>
                        </div>
                    </div>
                );
                setHomeLink(
                    <Link to="/" className="text-decoration-none nav-content-link">
                        <li className="list">Home</li>
                    </Link>
                )
            }
        };

        addMenu();        
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', addMenu);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', addMenu);
        }
    }, []);

    useEffect(() => {
        const displayLoginUsers = () => {        
            if(data){
                const token = data.accessToken
                setTokHol(token)
            }
           const img = data.userImage
           setImage(img)
        };

        displayLoginUsers();

        return () => displayLoginUsers;

    }, [data])

    return (
        <div className="position-fixed header--holder">
            <div className="position-relative d-flex align-items-start flex-column w-100 gap-3 inner-header">
                <header className={scroll ? "main-header header--scroll w-100" : 'main-header w-100'}>
                    <div className="d-inline-flex py-lg-3 px-lg-5 p-3 align-items-center justify-content-between w-100 header-content">
                        <div className="d-flex flex-column justify-content-center logo">
                            <h4 className='logo-name'>
                                <Link className='link' to="/">Pedxo</Link>
                            </h4>
                        </div>
                        <nav className="d-flex flex-column flex-lg-row align-items-center gap-4 nav-holder">
                            {menu}
                            <div className={nav ? "nav-content-hold" : 'nav-content-hold navb'}>
                                <ul className="d-flex align-items-center flex-column flex-lg-row col-12 nav nav-content">
                                    {mobileLogo}
                                    <div className="d-inline-flex align-items-start align-items-lg-center justify-content-center flex-column flex-xl-row p-0 nav-first-content">
                                        <div className="d-flex align-items-start align-items-lg-center justify-content-center flex-column flex-xl-row p-0 links-holder">
                                            {homeLink}
                                            <a href="/#about" className="text-decoration-none nav-content-link">
                                                <li className="list">About</li>
                                            </a>
                                        </div>
                                        <div className="position-relative d-flex align-items-start flex-column nav-sub-content-link">
                                            <li className="d-flex align-items-center text-center justify-content-between first-link" onClick={toggleServices}>
                                                <p>Solutions</p>
                                                {openServices ? <FaChevronUp className="position-relative fa" /> : <FaChevronDown className="position-relative fa" />}
                                            </li>
                                            <div className={openServices ? "position-absolute d-flex flex-column align-items-start dropdown" : "position-relative d-none dropdown"}>
                                                <li className="d-flex align-items-start dropdown-link">
                                                    <Link to="/hire">Hire a Developer</Link>
                                                </li>
                                                <li className="d-flex align-items-start dropdown-link">
                                                    <Link to="/outsource"> Employer of Record</Link>
                                                </li>
                                                <li className="d-flex align-items-start dropdown-link">
                                                    <Link to="/jobs">Payroll for Dev teams</Link>
                                                </li>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center flex-column flex-xl-row links-holder">
                                            <a href="/#faq" className="text-decoration-none nav-content-link">
                                                <li className="list">FAQ's</li>
                                            </a>
                                            <div className="position-relative d-flex align-items-start flex-column nav-sub-content-link">
                                            <li className="d-flex align-items-center text-center justify-content-between first-link" onClick={toggleResources}>
                                                <p>Resources</p>
                                                {openResources ? <FaChevronUp className="position-relative fa" /> : <FaChevronDown className="position-relative fa" />}
                                            </li>
                                            <div className={openResources ? "position-absolute d-flex flex-column align-items-start dropdown" : "position-relative d-none dropdown"}>
                                                <li className="d-flex align-items-start dropdown-link">
                                                    <Link to="/outsource">Build your MVP</Link>
                                                </li>
                                                <li className="d-flex align-items-start dropdown-link">
                                                    <Link to="/jobs">Find remote gigs</Link>
                                                </li>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column-reverse flex-xl-row align-items-center gap-3 nav-second-content">
                                        { tokHol ?
                                            <div className="position-relative d-flex align-items-start flex-column nav-sub-content-link">
                                                <div className="d-flex align-items-center text-center justify-content-between first-link" onClick={loginToggleServices}>
                                                    <div className="d-flex align-items-center text-center gap-1 user-info">
                                                        <div className="position-relative d-flex align-items-center justify-content-end sub-info">
                                                            <div className="d-flex align-items-center justify-content-center rounded-circle bg-white overflow-hidden img-con">
                                                                <div className="img-hld">
                                                                    {image ? <img className="img-fluid" src={image} alt="userImage"></img> : <img className="img-fluid" src={user} alt="userImage"></img>}
                                                                </div>
                                                            </div>
                                                            <div className="position-absolute active rounded-circle overflow-hidden">
                                                                <div className="active-indicator"></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p>{data.userName}</p>
                                                        </div>
                                                    </div>
                                                    {loginServices ? <FaChevronUp className="position-relative fa" /> : <FaChevronDown className="position-relative fa" />}
                                                </div>
                                                <div className={loginServices ? "position-absolute d-flex flex-column align-items-start dropdown" : "position-relative d-none dropdown"}>
                                                    <li className="d-flex align-items-start dropdown-link">
                                                        <Link to="/dashboard">Dashboard</Link>
                                                    </li>
                                                    <li className="d-flex align-items-start dropdown-link">
                                                        <Link to="/setting">Account setting</Link>
                                                    </li>
                                                    <hr />
                                                    <li className="d-flex align-items-start dropdown-link" onClick={logout}>
                                                        <p>Logout</p>
                                                    </li>
                                                </div>
                                            </div> :    <Link to="/login" className="d-flex justify-content-center align-items-center text-decoration-none second-con-link">
                                                            <li className="login-link">
                                                                <p>Login</p>
                                                            </li>
                                                        </Link>
                                        }
                                        <Link to="/request-a-demo" className="d-flex align-items-center justify-content-center text-decoration-none button-link">
                                            <li className="book">
                                                <p>Book demo</p>
                                            </li>
                                        </Link>
                                    </div>
                                </ul>
                            </div>
                        </nav>
                        
                        <Outlet />
                    </div>
                </header>
            </div>
        </div>
    )
}