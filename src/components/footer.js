import React from "react";
import { useState, useEffect } from "react";
import { Link, Outlet } from 'react-router-dom';
import { FaLinkedin, FaFacebookSquare, FaTwitterSquare, FaInstagramSquare } from "react-icons/fa";
import './css/footer.css'

export const Footer = () => {
    const [currentYear, setCurrentYear] = useState(null);

    useEffect(() => {
        const automateCurrentYear = () => {
            const year = new Date()
            setCurrentYear(year.getFullYear())
        }

        automateCurrentYear()

    }, [currentYear])

    return (
        <footer className="d-flex align-items-start flex-column gap-3 col-12 footer">
            <div className="d-flex flex-column align-items-start align-self-stretch footer-container">
                <div className="d-flex align-items-start align-self-stretch gap-4 footer-content">
                    <div className="d-flex flex-column align-items-start first-footer-content">
                        <div className="first-content-logo">
                            <h3>Pedxo</h3>
                        </div>
                        <div className="align-self-stretch first-content-ctc">
                            <h5>Contact sales</h5>
                            <Link to='mailto:support@pedxo.com' className="link">support@pedxo.com</Link>
                        </div>
                    </div>
                    <div className="d-flex align-items-start align-self-stretch gap-4 texts-link-holder">
                        <div className="d-flex flex-column align-items-start gap-4 second-footer-content">
                            <div className="align-self-stretch heading">
                                <h4>Company</h4>
                            </div>
                            <div className="d-flex align-items-start justify-content-left col-12 nav-links">
                                <nav className="nav-links-holder">
                                    <ul className="d-flex flex-column align-items-start justify-content-left align-self-stretch gap-3 nav-links-content">
                                        <li className="link">
                                            <Link to="/#about">About</Link>
                                        </li>
                                        <li className="link">
                                            <Link to="/work">Work at a Startup</Link>
                                        </li>
                                        <li className="link">
                                            <Link to="mailto:support@pedxo.com">Email us</Link>
                                        </li>
                                        <li className="link">
                                            <Link to="/request-a-demo">Speak to an Expert</Link>
                                        </li>
                                        <li className="link">
                                            <Link to="/#faq">FAQ's</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-start gap-4 third-footer-content">
                            <div className="align-self-stretch heading">
                                <h4>Services</h4>
                            </div>
                            <div className="d-flex align-items-start justify-content-left col-12 nav-links">
                                <nav className="nav-links-holder">
                                    <ul className="d-flex flex-column align-items-start justify-content-left align-self-stretch gap-3 nav-links-content">
                                        <li className="link">
                                            <Link to="/hire">Hire Talents</Link>
                                        </li>
                                        <li className="link">
                                            <Link to="/jobs">Find Jobs</Link>
                                        </li>
                                        <li className="link">
                                            <Link to="/outsource">Outsource Projects</Link>
                                        </li>
                                        <li className="link">
                                            <Link to="/request-Link-demo">Book Link Demo</Link>
                                        </li>
                                    </ul>
                                </nav>

                                <Outlet />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-start gap-4 fourth-footer-content">
                        <div className="align-self-stretch heading">
                            <h4>Socials</h4>
                        </div>
                        <div className="d-flex align-items-start gap-2 social-icons">                            
                            <Link className='icon' to='https://web.facebook.com/people/Pedxo/100090410366859' target='_blank' rel="noreferrer"><FaFacebookSquare /></Link>
                            <Link className='icon' to='https://www.instagram.com/usepedxo' target='_blank' rel="noreferrer"><FaInstagramSquare /></Link>
                            <Link className='icon' to='https://www.linkedin.com/company/pedxo' target='_blank' rel="noreferrer"><FaLinkedin /></Link>
                            <Link className='icon' to='https://x.com/getpedxo?t=gpwfcv7iZBw6myC0bkGJVw&s=09' target='_blank' rel="noreferrer"><FaTwitterSquare /></Link>
                        </div>
                    </div>
                </div>
                <div className="row flex-column align-items-start align-self-stretch gap-4 w-100 sub-footer-content">
                    <div className="d-flex flex-column align-self-stretch col-12 hr-con">
                        <hr />
                    </div>
                    <div className="d-flex align-items-center justify-content-between align-self-stretch sub-footer-item">
                        <div className="d-flex align-items-center gap-4 footer-pol">
                            <h5>Privacy Policy</h5>
                        </div>
                        <div className="footer-rights">
                            <h5> &copy; {currentYear} Pedxo. All rights reserved.</h5>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
};