import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import '../homeCss/outsource.css';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Link, Outlet } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { Loader } from "../../components/loader";
import { Modal } from "../../components/modal";
import axios from "axios";

export const Outsource = () => {
    const full_NameRef = useRef(null);
    const job_titleRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const employRef = useRef(null);
    const emailRef = useRef(null);
    const teamRef = useRef(null);
    const knowRef = useRef(null);
    const otherRef = useRef(null);
    const projectRef = useRef(null);
    const [full_Name, setFull_Name] = useState('');
    const [job_title, setJob_Title] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [employeeCount, setEmployeeCount] = useState('Company size');
    const [email, setEmail] = useState('');
    const [needed_team, setNeeded_Team] = useState(['Choose which workforce you will need e.g(UI/UX, devOps)']);
    const [knowUs, setKnowUs] = useState('Choose any');
    const [other, setOther] = useState('');
    const [project_description, setProject_Description] = useState('');
    const [option, setOption] = useState(false);
    const [any, setAny] = useState(false);
    const [team, setTeam] = useState(false);
    const [addFocus, setAddFocus] = useState(false);
    const [hideEmploy, setHideEmploy] = useState(false);
    const [hideNeed, setHideNeed] = useState(false);
    const [hideknow, setHideKnow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState(false);
    const [form, setForm] = useState(true);
    const [message, setMessage] = useState(null);
    const [footer, setFooter] = useState(null);
    const [icon, setIcon] = useState(null);
    const [showOther, setShowOther] = useState(null);
    const [check, setCheck] = useState([]);
    const [error, setError] = useState({});
    const employeeNumbers = ['1 - 30', '31 - 100', '101 - 400', '401 - 1000+'];
    const roles = ['UI/UX', 'Devops', 'Mobile Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full-stack Engineering', 'Data Scientist'];
    const Socials = ['Blog', 'Facebook', 'Google', 'Instagram', 'Referral', 'Twitter', 'Webinar', 'Linkedin', 'Others'];

    const toggleOption = () => {
        setOption(!option)
    };

    const chooseOption = () => {
        setAny(!any)
    };

    const openTeams = () => {
        setTeam(true)
    };

    const checked = (rle) => {
        if (check.includes(rle)) {
            setCheck(check.filter(item => item !== rle));
        } else {
            setCheck([...check, rle]);
        }
    };

    const selected = (e) => {
        setEmployeeCount(e)
        setOption(false)
        setHideEmploy(false)
    };

    const choosen = (e) => {
        setKnowUs(e)
        setAny(false)
        setHideKnow(false)
    };

    const changeColor = () => {
        setAddFocus(true)
    };

    const removeColor = () => {
        setAddFocus(false)
    };

    const done = () => {
        setHideNeed(false);
        if(check) {
            const addComa = check.join(', ');
            setNeeded_Team(addComa.split(', '));
            setTeam(false);
            setHideNeed(false);
            
            const size = () => {
                const height = document.getElementById('roleh');
                const ico = document.getElementById('fa');
                
                if(window.innerWidth > 900) {
                    if(check.length > 4){
                        height.style.height = 'fit-content';
                        height.style.padding = '7px 10px';
                        ico.style.fontSize = '19px';
                    } else {
                        height.style.height = '56px';
                        height.style.padding = '20px 16px';
                        ico.style.fontSize = '16px';
                    } 
                } else {
                    if(check.length > 4 ){
                        height.style.height = 'fit-content';
                        height.style.padding = '7px 10px';
                        ico.style.fontSize = '30px';
                    } else {
                        height.style.height = '56px';
                        height.style.padding = '20px 16px';
                        ico.style.fontSize = '16px';
                    } 
                }
            };

            size ();

            window.addEventListener('resize', size);

            return () => {
                window.removeEventListener('resize', size)
            }
        };
    };

    const cancel = () => {
        const ori = ['Choose which workforce you will need e.g(UI/UX, devOps)']
        const height = document.getElementById('roleh');
        const ico = document.getElementById('fa');
        setNeeded_Team(ori);
        setTeam(false);
        setCheck([]);
        height.style.height = '56px';
        height.style.padding = '20px 16px';
        ico.style.fontSize = '16px';
    };

    const handleChange = useCallback((e) => {
        const {name, value} = e.target;

        setError({ ...error, [name]: undefined});
        setFull_Name(name === 'full_Name' ? value: full_Name);
        setJob_Title(name === 'job_title' ? value: job_title);
        setPhoneNumber(name === 'phoneNumber' ? value: phoneNumber);
        setEmail( name === 'email' ? value: email);
        setProject_Description(name === 'project_description' ? value: project_description);
        setOther(name === 'other' ? value: other);

    }, [full_Name, email, job_title, other, phoneNumber, project_description, error,])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const employee = document.getElementById('employee');
        const need_teams = document.getElementById('teams');        
        const know = document.getElementById('knowHow');

        const err = {};

        const numberRegex = /\d/;
        const symbols = /[!@#$%^&*]/;
        const emil = /[@]/;
        const symbol = /[!#$%^&*]/;
        const words = full_Name.trim().split(/\s+/);
        const space = /\s/g;
        const alphaBig = /[A-Z]/;
        const alphaSmall = /[a-z]/;

        if(!full_Name) {

            err.full_Name = <p>Input required</p>

            if(full_NameRef.current){
                full_NameRef.current.focus()
            }

        } else if(numberRegex.test(full_Name) || symbols.test(full_Name)) {

            err.full_Name = <p>Incorrect name, check your spellings</p>

            if(full_NameRef.current){
                full_NameRef.current.focus()
            }

        } else if(full_Name.startsWith(' ')) {
        
            err.full_Name = <p>No space allowed</p>

            if(full_NameRef.current){
                full_NameRef.current.focus()
            }

        } else if (words.length < 2 || words.length === 1) {

            err.full_Name = <p> Enter your full name </p>

            if(full_NameRef.current){
                full_NameRef.current.focus()
            }

        } else if(!job_title) {

            err.job_title = <p>Input required</p>

            if(job_titleRef.current){
                job_titleRef.current.focus()
            }

        } else if(numberRegex.test(job_title) || symbols.test(job_title)) {

            err.job_title = <p>Wrong position</p>
            
            if(job_titleRef.current){
                job_titleRef.current.focus()
            }


        } else if(space.test(job_title)){
            
            err.job_title = <p>No space allowed</p>

            if(job_titleRef.current){
                job_titleRef.current.focus()
            }


        } else if(!phoneNumber) {

            err.phoneNumber = <p>Input required</p>

            if(phoneNumberRef.current){
                phoneNumberRef.current.focus()
            }

        } else if(!phoneNumber.startsWith('+')) {

            err.phoneNumber = <p>Phone number must start with '+' and country code</p>

            if(phoneNumberRef.current){
                phoneNumberRef.current.focus()
            }

        } else if(!numberRegex.test(phoneNumber) || alphaBig.test(phoneNumber) || alphaSmall.test(phoneNumber)) {

            err.phoneNumber = <p>wrong phone number format</p>

            if(phoneNumberRef.current){
                phoneNumberRef.current.focus()
            }

        } else if(employee.textContent === 'Company size'){
           
            setHideEmploy(true);
            err.employeeCount = 'input required'

            if(employRef.current){
                employRef.current.focus()
            }

        } else if(!email) {
            
            err.email = <p>Input required</p>

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

        } else if(need_teams.textContent === 'Choose which workforce you will need e.g(UI/UX, devOps)') {

            setHideNeed(true);
            err.needed_team = 'input required'

            if(teamRef.current){
                teamRef.current.focus()
            }

        } else if(know.textContent === "Choose any") {

            setHideKnow(true);
            err.knowUs = 'input required'

            if(knowRef.current){
                knowRef.current.focus()
            }

        } else if(know.textContent === 'Others' && !other) {
        
            err.other = <p>input required</p>

            if(otherRef.current){
                otherRef.current.focus()
            }

        }  else if(!project_description) {
        
            err.project_description = <p>input required</p>

            if(projectRef.current){
                projectRef.current.focus()
            }

        } else if(symbol.test(project_description)) {

            err.project_description  = <p>Use of symbols are not allowed except @(form emphasis and importance)</p>

            if(projectRef.current){
                projectRef.current.focus()
            }

        } else {
            const outsourceDetails = {
                full_Name,
                job_title,
                phoneNumber,
                employeeCount,
                email,
                needed_team,
                knowUs: knowUs.includes('Others') ? other : knowUs,
                project_description
            };

            const button = document.getElementById('button');
            const button2 = document.getElementById('btn');

            try {
                setLoading(true);
                button.disabled = true;
                button2.style.opacity = '50%';

                const url = 'https://pedxo-backend-p7se.onrender.com/outsource';
                const res = await axios.post(url, outsourceDetails);

                if(res) {

                    setSuccess(true);
                    setForm(false);
                    
                };

            } catch(err) {

                button.disabled = false
                button2.style.opacity = '100%'
                
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
                        if (status === 400 && err.response.data.message[0] === "phoneNumber must be a valid phone number"){
                            err.phoneNumber = <p>Invalid phone number, check your phone number and try again</p>

                            if(phoneNumberRef.current){
                                phoneNumberRef.current.focus()
                            }
                        } else if(status === 500 && err.response.data.message === 'Internal server error'){
                            setMessage("Couldn't connect, timeout");
                        };
                    }

                    if(err.message === "Network Error"){
                        setMessage('Network error, check your network');
                    }
                }

            } finally {
                setLoading(false);
            }
        }


        if (Object.keys(err).length > 0) {
            setError(err);
            return;
        }
    };

    useEffect(() => {
        if(message === 'Network error, check your network' || message === "Couldn't connect, timeout" || message === "Invalid phone number, check it again") {
            setMessages(true);

            const rem = setTimeout(() => {
                setMessages(false);
            }, 3000);

            return () => clearTimeout(rem);
        };

        if(knowUs.includes('Others')) {

            setShowOther(
                <div className="d-flex align-items-start align-self-stretch gap-5 col-12 other-field">
                    <div className='other-content d-flex flex-column gap-1 col-12'>
                        <label className='d-flex align-items-center gap-1 text-uppercase align-self-stretch'>Enter how you heared about us</label>
                        <input className="p-3 col-12 rounded-2 text-capitalize" name="other" value={other} type='text' placeholder='How did you hear about us?' onChange={(e) => handleChange(e)} ref={otherRef}></input>
                        {error.other}
                    </div>
                </div>
            )
        } else {

            setShowOther(null)

        }

        const showFooter = () => {
            if(window.innerWidth > 900) {
                setFooter(<Footer/> );
            } else {
                setFooter(null)
            }
        };

        showFooter();

        window.addEventListener('resize', showFooter);

        document.title = 'Low-cost MVP builder'

        return () => {
            window.removeEventListener('resize', showFooter);
        };

    }, [message, error, knowUs, other, handleChange]);



    return (
        <div className="outsource">
            <div className="sub-outsource-holder">
                <Header />
                <div className='d-flex align-items-center justify-content-center align-self-stretch p-5 container inner-sec'>
                    <div className='d-flex flex-column align-items-center align-self-stretch outsource-holder'>
                        <div className='d-flex flex-column align-items-center desc-heading'>
                            <div className='align-items-stretch text-center desc-first-heading'>
                                <h4>Outsource Project</h4>
                            </div>
                            <div className='align-items-stretch text-center desc-second-heading'>
                                <h6>Bring your idea to market quickly with just minimal resources.</h6>
                            </div>
                        </div>
                        <div className='d-flex flex-column align-items-start form-holder'>
                            <div className='col-12 inner-form'>
                                {form  &&    <form method='post' className='d-flex flex-column align-items-start align-self-stretch gap-4 form' autoComplete="off" onSubmit={handleSubmit}>
                                                <div className='d-flex flex-column align-items-start align-self-stretch gap-4 input-holder'>
                                                    <div className='d-flex align-items-start align-self-stretch first-input-field-holder'>
                                                        <div className='d-flex flex-column align-items-start align-self-stretch col-12 name-field-holder'>
                                                            <label>Full Name</label>
                                                            <input className="col-12" name="full_Name" value={full_Name} type='text' placeholder='Enter your full name' onChange={(e) => handleChange(e)} ref={full_NameRef}></input>
                                                            {error.full_Name}
                                                        </div>
                                                    </div>  
                                                    <div className='d-flex align-items-center align-self-stretch second-input-field-holder'>
                                                        <div className='d-flex flex-column align-items-start w-100 job-field-holder'>
                                                            <label>Job Title</label>
                                                            <input className="col-12" name="job_title" value={job_title} type='text' placeholder='Enter job title, e.g CEO' onChange={(e) => handleChange(e)} ref={job_titleRef}></input>
                                                            {error.job_title}
                                                        </div>
                                                        <div className='d-flex flex-column align-items-start w-100 number-field-holder'>
                                                            <label>Phone Number</label>
                                                            <input className="d-flex align-items-center align-self-stretch col-12 p-3" name="phoneNumber" value={phoneNumber} type='tel' placeholder='Enter phone number with country code' onChange={(e) => handleChange(e)} ref={phoneNumberRef}></input>
                                                            {error.phoneNumber}
                                                        </div>
                                                    </div>                                  
                                                    <div className='d-flex align-items-start align-self-stretch third-input-field-holder'>
                                                        <div className='d-flex flex-column align-items-start w-100 count-field-holder'>
                                                            <label>Employees CountDown</label>
                                                            <div className='d-flex flex-column align-items-start justify-content-center align-self-stretch count-input-holder'>
                                                                <div className='d-flex align-items-center justify-content-between align-self-stretch col-12 count-input' onClick={() => toggleOption()} ref={employRef} >
                                                                    <div id="employee" className={employeeCount === 'Company size' ? 'input' : 'option'}>{employeeCount}</div>
                                                                    <FaChevronDown className={option ? 'active' : 'fa'} />
                                                                </div>
                                                                {hideEmploy && <p>{error.employeeCount}</p>}
                                                                <div className={option ? 'd-flex flex-column align-items-start justify-content-left col-12 select-box open' : 'd-flex flex-column align-items-start justify-content-left col-12 select-box'}>
                                                                    <ul className='d-flex flex-column align-items-start justify-content-left align-self-stretch col-12 p-0 m-0 select-list'>
                                                                        {employeeNumbers.map((employeeNumber) => (
                                                                            <li className='d-flex  align-items-start justify-content-left align-self-stretch list' onClick={() => selected(employeeNumber.replace(/\s/g, ''))}>
                                                                                <p>{employeeNumber}</p>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='position-relative w-100 email-field-holder'>
                                                            <label>Email</label>
                                                            <div className="position-relative col-12 ico">
                                                                <input className="w-100" name="email" value={email} type='email' placeholder='Enter work email' onFocus={changeColor} onBlur={removeColor} onChange={(e) => handleChange(e)} ref={emailRef}></input>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={addFocus ? 'position-absolute mail focus' : 'position-absolute mail'}>
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8323 17.5C17.6732 17.5 19.1656 16.0076 19.1656 14.1667V6.68557C19.1659 6.67283 19.1659 6.66005 19.1656 6.64725V5.83333C19.1656 3.99238 17.6732 2.5 15.8323 2.5H4.16559C2.32464 2.5 0.832253 3.99238 0.832253 5.83333V6.64726C0.831957 6.66005 0.831958 6.67282 0.832253 6.68556V14.1667C0.832253 16.0076 2.32464 17.5 4.16559 17.5H15.8323ZM2.49892 14.1667C2.49892 15.0871 3.24511 15.8333 4.16559 15.8333H15.8323C16.7527 15.8333 17.4989 15.0871 17.4989 14.1667V7.89753L11.2369 10.4023C10.4422 10.7202 9.55565 10.7202 8.76095 10.4023L2.49892 7.89753V14.1667ZM10.6179 8.85488L17.4989 6.10247V5.83333C17.4989 4.91286 16.7527 4.16667 15.8323 4.16667H4.16559C3.24511 4.16667 2.49892 4.91286 2.49892 5.83333V6.10247L9.37993 8.85488C9.77729 9.01382 10.2206 9.01382 10.6179 8.85488Z"/>
                                                                </svg>
                                                            </div>
                                                            {error.email}
                                                        </div>
                                                    </div>
                                                    <div className='d-flex align-items-start align-self-stretch justify-content-center fourth-input-field-holder'>
                                                        <div className="d-flex flex-column align-items-start team-field-holder">
                                                            <label>Which team will you be needing for the project?</label>
                                                            <div className="d-flex flex-column align-items-start justify-content-center align-self-stretch team-input-holder">
                                                                <div className="d-flex align-items-center justify-content-between align-self-stretch team-input"  id="roleh"  onClick={() => openTeams()} ref={teamRef}>
                                                                    <div id="teams" className={needed_team.includes('Choose which workforce you will need e.g(UI/UX, devOps)') ? 'input' : 'option'}>{needed_team.join(', ')}</div>
                                                                    <FaChevronDown className={team ? 'active' : "fa"} id="fa"/>
                                                                </div>
                                                                {hideNeed && <p>{error.needed_team}</p>}
                                                                <div className={team ? 'd-flex flex-column align-items-start justify-content-left select-box open' : "d-flex flex-column align-items-start justify-content-left select-box"}>
                                                                    <ul className= "d-flex flex-column align-items-start justify-content-left align-self-stretch p-0 m-0 col-12 select-list">
                                                                        {roles.map((rle) => (
                                                                            <li className="d-flex align-items-start justify-content-left align-self-stretch list" onClick={() => checked(rle)}>
                                                                                <div className={check.indexOf(rle) !== -1 ? "d-flex align-items-center justify-content-center align-self-stretch list-checkbox click" : "d-flex align-items-center justify-content-center align-self-stretch list-checkbox"}>
                                                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className={check.indexOf(rle) !== -1 ? 'fa show' : 'fa'} xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                                                                                    </svg>
                                                                                </div>
                                                                                <p>{rle}</p>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <div className="d-flex align-items-center justify-content-between align-self-stretch select-button">
                                                                        <div onClick={() => cancel()} className="d-flex flex-column align-items-center justify-content-center align-self-stretch first-button">
                                                                            <button type="button">Cancel</button>
                                                                        </div>
                                                                        <div onClick={() => done()} className="d-flex flex-column align-items-center justify-content-center align-self-stretch second-button">
                                                                            <button type="button">Done</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex flex-column align-items-start name-field-holder'>
                                                            <label>How did you hear about us?</label>
                                                            <div className='d-flex flex-column align-items-start justify-content-center align-self-stretch social-input-holder'>
                                                                <div className='d-flex align-items-center justify-content-between align-self-stretch social-input'  onClick={() => chooseOption()} ref={knowRef}>
                                                                    <div id="knowHow" className={knowUs === 'Choose any' ? 'input' : 'option'}>{knowUs}</div>
                                                                    <FaChevronDown className={any ? 'active' : 'fa'} />
                                                                </div>
                                                                {hideknow && <p>{error.knowUs}</p>}
                                                                <div className={any ? 'd-flex flex-column align-items-start justify-content-left col-12 social-box open' : 'd-flex flex-column align-items-start justify-content-left col-12 social-box'}>
                                                                    <ul className='d-flex flex-column align-items-start justify-content-left align-self-stretch p-0 m-0 col-12 social-list'>
                                                                        {Socials.map((Social) => (
                                                                            <li className='d-flex align-items-start justify-content-left align-self-stretch list' onClick={() => choosen(Social)}>
                                                                                <p>{Social}</p>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    { showOther }
                                                    <div className="d-flex flex-column align-items-start align-self-stretch fifth-input-field-holder">
                                                        <div className="d-flex flex-column align-items-start align-self-stretch col-12 des-field-holder">
                                                            <label>Describe your project</label>
                                                            <textarea name="project_description" value={project_description} cols={30} rows={50} placeholder="Describe what you're trying to outsource here" onChange={(e) => handleChange(e)} ref={projectRef}></textarea>
                                                            {error.project_description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='d-flex flex-column align-items-start justify-content-center align-self-stretch col-12 submit-item-holder'>
                                                    <div className='d-flex flex-column align-items-center justify-content-center align-self-stretch submit-des'>
                                                        <h6>We respect your data. By submitting this form, you agree that we will contact you in relation to our products and services.</h6>
                                                    </div>
                                                    <div className='d-flex flex-column align-items-center justify-content-center align-self-stretch col-12 submit-button-link-holder'>
                                                        <div className='d-flex flex-column align-items-center justify-content-center align-self-stretch col-12 submit-button' id="btn">
                                                            <button className="d-flex align-items-center justify-content-center col-12" type='submit' id="button">
                                                                <p className='pa'>Submit</p>
                                                            </button>
                                                        </div>
                                                        <div className='d-flex align-items-center justify-content-center align-self-stretch submit-link'>
                                                            <p className='d-flex align-items-center pa'>Contractor or employee?</p>
                                                            <Link to='/register' className='d-flex align-items-center link'>Sign up</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                }
                            </div>
                            {success && <div className="d-flex flex-column justify-content-center w-100 success-message">
                                            <div className="d-flex flex-column align-items-center justify-content-center success-hold">
                                                <div className="d-flex align-items-center justify-content-center success">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className='fa' viewBox="0 0 100 101" fill="none">
                                                        <path d="M37.5 50.5L45.8333 58.8333L62.5 42.1667M87.5 50.5C87.5 71.2107 70.7107 88 50 88C29.2893 88 12.5 71.2107 12.5 50.5C12.5 29.7893 29.2893 13 50 13C70.7107 13 87.5 29.7893 87.5 50.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <div className="success-text text-center">
                                                    <p>Thank you for requesting to collaborate with us. <br /> A Pedxo advisor will be in touch shortly <br /> at:<span>{email}</span></p>
                                                </div>
                                                <div className="success-link">  
                                                    <Link to='/' className="d-flex flex-column align-items-center justify-content-center col-12 link">Return to homepage</Link>
                                                </div>
                                            </div>
                                        </div>
                            }
                        </div>
                    </div>
                </div>
                {loading && <Loader />}
                {messages && <Modal icon={icon} message={message} />}
                {footer}
            </div>
            <Outlet />
        </div>
    )
}