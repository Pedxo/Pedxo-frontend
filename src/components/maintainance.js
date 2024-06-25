import { Link } from 'react-router-dom';
import MaintainanceIMG from '../Img/Computer troubleshooting-amico.svg';
import './css/maintainance.css';

export const Maintainance = () => {
    return (
        <div className="text-center fs-4 d-flex justify-content-center py-4 col-12 overflow-hidden maintainance-holder">
            <div className='d-flex justify-content-center flex-column gap-5 px-3 overflow-hidden sub-holder py-2 col-12'>
                <div className='col-8 col-lg-3 col-sm-4'>
                    <img className='img-fluid' src={MaintainanceIMG} alt='It is undergoing updates'></img>
                </div>
                <div className='col-12 text col-sm-7'>
                    <p>We are currently undergoing maintainance on this page. <br /> It will be restored back once the update is over.</p>
                </div>
                <Link to={'/'} className='link d-flex justify-content-center'>
                    <p>Back to Homepage</p>
                </Link>
            </div>
        </div>
    )
};