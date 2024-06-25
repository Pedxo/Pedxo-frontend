import React from "react";
import './css/loader.css'

export const Loader = () => {
    return (
        <div className="position-fixed top-0 end-0 col-12 loader">
            <div className="d-flex flex-column align-items-center align-self-stretch justify-content-center col-12 loder-holder">
                <div className="d-flex flex-column align-items-center justify-content-center loader-con">
                    <div className="load"></div>
                </div>
            </div>
        </div>
    )
}