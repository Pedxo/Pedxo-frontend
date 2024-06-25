import React from "react";
import '../auth/authCss/logo.css'

export const Logo = () => {
    return (
        <div className='d-flex flex-column align-items-center justify-content-center col-lg-6 Logo-content-holder'>
            <div className='d-flex justify-content-between flex-column align-items-start col-12 logo-content'>
                <div className='logo'>
                    <h3 className="link">
                        <a href="/">Pedxo</a>
                    </h3>
                </div>
                <div className='d-flex flex-column align-items-start gap-4 content'>
                    <h2>Your <span>startup's technical</span> department on subscription.</h2>
                </div>
            </div>
        </div>
    )
}