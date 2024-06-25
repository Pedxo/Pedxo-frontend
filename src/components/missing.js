import { Link } from 'react-router-dom';
import Oops from  '../Img/404 error with a tired person-bro.svg';
import './css/error.css'

export const Missing = () => {
    return (
        <div className="text-center fs-4 d-flex justify-content-center py-4 col-12 Oops-holder">
            <div className='d-flex justify-content-center flex-column gap-5 px-3 sub-holder py-2 col-12'>
                <div className='col-8 col-lg-3 col-sm-4'>
                    <img className='img-fluid' src={Oops} alt='It is undergoing updates'></img>
                </div>
                <div className='col-12 text col-sm-7'>
                    <p>Page not found.</p>
                </div>
                <Link to={'/'} className='link d-flex justify-content-center'>
                    <p>Back to Homepage</p>
                </Link>
            </div>
        </div>
    )
}