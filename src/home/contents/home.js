import React from 'react';
import '../homeCss/home.css';
import aboutImg from '../../Img/About.png';
import { FaArrowRight, FaPlus, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Link, Outlet, useNavigate } from 'react-router-dom';


export const Home = () => {
    const [devCount, setDevCount] = useState(0);
    const [designCount, setDesignCount] = useState(0);
    const [contractCount, setContractCount] = useState(0);
    const [activeFaq, setActiveFaq] = useState(null);
    const navigate = useNavigate()

    const selectedFaq = (i) => {
        if(activeFaq === i){
            setActiveFaq(null)
        } else {
            setActiveFaq(i)
        }
    };

    const bookDemo = () => {
        navigate('/request-a-demo')
    };

    const serviceSlide = {
        dots: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false,
        initialSlide: 0,
        speed: 200,
        arrows: true,
        prevArrow: (
            <button type='button'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 22" className='fa'>
                    <path d="M7.96982 6.42676L3.88648 10.5101L3.39648 11.0001L3.88648 11.4901L7.96982 15.5734L8.92668 14.5934L6.01186 11.6806H19.6665V10.3195H6.01254L8.92668 7.40676L7.96846 6.42676H7.96982Z"/>
                    <path d="M7.96982 6.42676L3.88648 10.5101L3.39648 11.0001L3.88648 11.4901L7.96982 15.5734L8.92668 14.5934L6.01186 11.6806H19.6665V10.3195H6.01254L8.92668 7.40676L7.96846 6.42676H7.96982Z"/>
                    <path d="M7.96982 6.42676L3.88648 10.5101L3.39648 11.0001L3.88648 11.4901L7.96982 15.5734L8.92668 14.5934L6.01186 11.6806H19.6665V10.3195H6.01254L8.92668 7.40676L7.96846 6.42676H7.96982Z"/>
                    <path d="M7.96982 6.42676L3.88648 10.5101L3.39648 11.0001L3.88648 11.4901L7.96982 15.5734L8.92668 14.5934L6.01186 11.6806H19.6665V10.3195H6.01254L8.92668 7.40676L7.96846 6.42676H7.96982Z"/>
                </svg>
            </button>
        ),
        nextArrow: (
            <button type='button'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 22" className='fa'>
                    <path d="M15.0302 6.42676L19.1135 10.5101L19.6035 11.0001L19.1135 11.4901L15.0302 15.5734L14.0733 14.5934L16.9881 11.6806H3.33348V10.3195H16.9875L14.0733 7.40676L15.0315 6.42676H15.0302Z"/>
                    <path d="M15.0302 6.42676L19.1135 10.5101L19.6035 11.0001L19.1135 11.4901L15.0302 15.5734L14.0733 14.5934L16.9881 11.6806H3.33348V10.3195H16.9875L14.0733 7.40676L15.0315 6.42676H15.0302Z"/>
                    <path d="M15.0302 6.42676L19.1135 10.5101L19.6035 11.0001L19.1135 11.4901L15.0302 15.5734L14.0733 14.5934L16.9881 11.6806H3.33348V10.3195H16.9875L14.0733 7.40676L15.0315 6.42676H15.0302Z"/>
                    <path d="M15.0302 6.42676L19.1135 10.5101L19.6035 11.0001L19.1135 11.4901L15.0302 15.5734L14.0733 14.5934L16.9881 11.6806H3.33348V10.3195H16.9875L14.0733 7.40676L15.0315 6.42676H15.0302Z"/>
                </svg>
            </button>
        )
    };

    const testimonal = {
        dots: false,
        infinite: true,
        slidesToShow: 5.5,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        cssEase: 'linear',
        autoplaySpeed: 4000,
        swipe: false,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2.07,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const remoteInfos = [
        {title: 'Hire', subTitle: 'remote employees', des: 'Join the fleet of companies that are benefiting from remote work arrangements by allowing their employees to live and work from any corner of the world while saving a lot of cash.', link: '/hire', icons: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className='fa'>
            <path d="M22.8201 23.1805C20.8973 23.1805 19.0176 22.6103 17.4188 21.542C15.82 20.4738 14.5738 18.9553 13.838 17.1788C13.1021 15.4023 12.9096 13.4475 13.2847 11.5616C13.6599 9.67567 14.5858 7.94334 15.9455 6.58366C17.3052 5.22398 19.0375 4.29803 20.9234 3.9229C22.8094 3.54776 24.7642 3.7403 26.5407 4.47615C28.3172 5.212 29.8356 6.45812 30.9039 8.05693C31.9722 9.65574 32.5424 11.5354 32.5424 13.4583C32.5424 16.0368 31.5181 18.5097 29.6948 20.333C27.8715 22.1562 25.3986 23.1805 22.8201 23.1805ZM22.8201 6.62498C21.4467 6.62498 20.104 7.03226 18.962 7.79533C17.82 8.55839 16.9299 9.64297 16.4043 10.9119C15.8787 12.1808 15.7412 13.5771 16.0091 14.9242C16.2771 16.2713 16.9385 17.5087 17.9097 18.4799C18.8809 19.4511 20.1183 20.1125 21.4653 20.3804C22.8124 20.6484 24.2087 20.5109 25.4777 19.9853C26.7466 19.4596 27.8312 18.5696 28.5942 17.4275C29.3573 16.2855 29.7646 14.9429 29.7646 13.5694C29.7646 12.6575 29.585 11.7544 29.236 10.9119C28.887 10.0694 28.3755 9.30381 27.7306 8.65896C27.0858 8.01411 26.3202 7.50258 25.4777 7.15359C24.6351 6.8046 23.7321 6.62498 22.8201 6.62498ZM30.5563 24.8611C23.0402 23.1698 15.1771 23.9844 8.16736 27.1805C7.20333 27.641 6.38995 28.3659 5.82195 29.2708C5.25394 30.1757 4.95469 31.2233 4.95903 32.2916V40.5555C4.95903 40.7379 4.99496 40.9185 5.06475 41.087C5.13455 41.2555 5.23686 41.4087 5.36583 41.5376C5.4948 41.6666 5.64791 41.7689 5.81642 41.8387C5.98492 41.9085 6.16553 41.9444 6.34792 41.9444C6.53031 41.9444 6.71092 41.9085 6.87942 41.8387C7.04793 41.7689 7.20104 41.6666 7.33001 41.5376C7.45898 41.4087 7.56129 41.2555 7.63109 41.087C7.70088 40.9185 7.73681 40.7379 7.73681 40.5555V32.2916C7.72472 31.751 7.87072 31.2185 8.15692 30.7596C8.44311 30.3007 8.85704 29.9353 9.34792 29.7083C13.5705 27.7586 18.1692 26.7583 22.8201 26.7778C25.4261 26.7744 28.0232 27.0822 30.5563 27.6944V24.8611ZM30.7507 38.0694H39.2785V40.0139H30.7507V38.0694Z"/>
            <path d="M46.0699 29.8195H38.8893V32.5972H44.681V44.2222H25.0004V32.5972H33.7504V33.1806C33.7504 33.5489 33.8968 33.9022 34.1572 34.1627C34.4177 34.4231 34.771 34.5695 35.1393 34.5695C35.5077 34.5695 35.8609 34.4231 36.1214 34.1627C36.3819 33.9022 36.5282 33.5489 36.5282 33.1806V27.7778C36.5282 27.4094 36.3819 27.0562 36.1214 26.7957C35.8609 26.5352 35.5077 26.3889 35.1393 26.3889C34.771 26.3889 34.4177 26.5352 34.1572 26.7957C33.8968 27.0562 33.7504 27.4094 33.7504 27.7778V29.8195H23.6115C23.2432 29.8195 22.8899 29.9658 22.6295 30.2263C22.369 30.4867 22.2227 30.84 22.2227 31.2084V45.6111C22.2227 45.9795 22.369 46.3328 22.6295 46.5932C22.8899 46.8537 23.2432 47 23.6115 47H46.0699C46.4382 47 46.7915 46.8537 47.052 46.5932C47.3124 46.3328 47.4588 45.9795 47.4588 45.6111V31.2084C47.4588 30.84 47.3124 30.4867 47.052 30.2263C46.7915 29.9658 46.4382 29.8195 46.0699 29.8195Z"/>
        </svg>},
        {title: 'MVP', subTitle: 'development', des: 'Designed to help non-technical teams stay launched. A technical department, on subscription.', link: '/jobs', icons: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 42" className='fa'>
            <g clipPath="url(#clip0_113_106)">
                <path d="M16.7082 22.9896C19.8001 22.9896 22.2892 25.4825 22.2892 28.5707C22.2892 31.6626 19.8001 34.148 16.7082 34.148C13.6163 34.148 11.1272 31.6626 11.1272 28.5707C11.1272 25.4825 13.6163 22.9896 16.7082 22.9896ZM1.36035 16.631C2.25052 17.5397 3.48579 18.1062 4.8485 18.1062H5.63356C5.9461 19.3052 7.04277 20.1991 8.33664 20.1991C9.62679 20.1991 10.7235 19.3052 11.036 18.1062H22.3804C22.6929 19.3052 23.7905 20.1991 25.0835 20.1991C26.3736 20.1991 27.4675 19.3052 27.7791 18.1062H28.5679C29.9306 18.1062 31.1659 17.5435 32.0561 16.6347V22.9896C32.0561 25.6964 29.8795 27.873 27.1726 27.873H23.6519C23.2994 24.356 20.3163 21.5944 16.7082 21.5944C13.1001 21.5944 10.1207 24.356 9.76446 27.873H6.24375C3.53695 27.873 1.36035 25.6964 1.36035 22.9896V16.631ZM25.0835 16.0133C25.8611 16.0133 26.4713 16.6272 26.4713 17.4086C26.4713 18.1862 25.8611 18.8038 25.0835 18.8038C24.3021 18.8038 23.6882 18.1862 23.6882 17.4086C23.6882 16.6272 24.3021 16.0133 25.0835 16.0133ZM8.33664 16.0133C9.11427 16.0133 9.7319 16.6272 9.7319 17.4086C9.7319 18.1862 9.11427 18.8038 8.33664 18.8038C7.5553 18.8038 6.93766 18.1862 6.93766 17.4086C6.93766 16.6272 7.5553 16.0133 8.33664 16.0133ZM6.24375 5.54887H27.1726C29.8795 5.54887 32.0561 7.72547 32.0561 10.4286V13.2191C32.0561 15.1557 30.5008 16.7109 28.5679 16.7109H27.7791C27.4703 15.512 26.3764 14.6181 25.0835 14.6181C23.7905 14.6181 22.6929 15.512 22.3804 16.7109H11.036C10.7272 15.512 9.63052 14.6181 8.33664 14.6181C7.04277 14.6181 5.94238 15.512 5.63356 16.7109H4.8485C2.9156 16.7109 1.36035 15.1557 1.36035 13.2191V10.4286C1.36035 7.72547 3.53695 5.54887 6.24375 5.54887ZM13.9177 1.35937H19.4987C19.895 1.35937 20.1964 1.66819 20.1964 2.06072V4.15361H13.2238V2.06072C13.2238 1.66819 13.5251 1.35937 13.9177 1.35937ZM13.9177 -0.03589C12.7698 -0.03589 11.8248 0.912887 11.8248 2.06072V4.15361H6.24375C2.78444 4.15361 -0.0349135 6.96924 -0.0349135 10.4286V22.9896C-0.0349135 26.4489 2.78444 29.2683 6.24375 29.2683H9.76446C10.117 32.789 13.1001 35.547 16.7082 35.547C18.3797 35.547 19.9164 34.9544 21.1228 33.9703L25.9848 38.8323C26.2574 39.1011 26.6973 39.1011 26.9662 38.8323C27.2424 38.5598 27.2424 38.1161 26.9662 37.8436L22.1079 32.9815C22.9543 31.95 23.5143 30.671 23.6519 29.2683H27.1726C30.632 29.2683 33.4513 26.4489 33.4513 22.9896V10.4286C33.4513 6.96924 30.632 4.15361 27.1726 4.15361H21.5916V2.06072C21.5916 0.912887 20.6466 -0.03589 19.4987 -0.03589H13.9177Z"/>
                <path fill-rule="evenodd" clipRule="evenodd" d="M11.3597 2.06072C11.3597 0.6571 12.5119 -0.500977 13.9177 -0.500977H19.4987C20.9045 -0.500977 22.0567 0.6571 22.0567 2.06072V3.68852H27.1726C30.8885 3.68852 33.9164 6.71202 33.9164 10.4286V22.9896C33.9164 26.7058 30.8888 29.7334 27.1726 29.7334H24.0614C23.8752 30.9211 23.4044 32.0139 22.7262 32.9424L27.2928 37.5125L27.294 37.5137C27.7532 37.9681 27.7532 38.7078 27.294 39.1622C26.8422 39.6129 26.1103 39.6093 25.6582 39.1634L25.656 39.1612L21.0828 34.588C19.8525 35.482 18.3407 36.012 16.7082 36.012C13.0029 36.012 9.91714 33.2869 9.35568 29.7334H6.24375C2.52758 29.7334 -0.5 26.7058 -0.5 22.9896V10.4286C-0.5 6.71202 2.52794 3.68852 6.24375 3.68852H11.3597V2.06072ZM13.9177 0.429197C13.0278 0.429197 12.2899 1.16867 12.2899 2.06072V4.6187H6.24375C3.04094 4.6187 0.430173 7.22646 0.430173 10.4286V22.9896C0.430173 26.1921 3.0413 28.8032 6.24375 28.8032H10.1853L10.2272 29.2219C10.5562 32.5074 13.3415 35.0819 16.7082 35.0819C18.2678 35.0819 19.7016 34.5294 20.8288 33.6099L21.1545 33.3443L26.3114 38.5012L26.3123 38.502C26.405 38.5926 26.5516 38.5891 26.6373 38.5035L26.6395 38.5012C26.7312 38.4108 26.7312 38.2651 26.6395 38.1746L26.6372 38.1723L21.481 33.0122L21.7483 32.6865C22.5391 31.7229 23.0608 30.5299 23.1891 29.2229L23.2303 28.8032H27.1726C30.3751 28.8032 32.9862 26.1921 32.9862 22.9896V10.4286C32.9862 7.22646 30.3755 4.6187 27.1726 4.6187H21.1265V2.06072C21.1265 1.16867 20.3886 0.429197 19.4987 0.429197H13.9177ZM13.9177 1.82446C13.7885 1.82446 13.6889 1.91852 13.6889 2.06072V3.68852H19.7313V2.06072C19.7313 1.92016 19.6333 1.82446 19.4987 1.82446H13.9177ZM12.7587 2.06072C12.7587 1.41786 13.2618 0.894283 13.9177 0.894283H19.4987C20.1567 0.894283 20.6614 1.41621 20.6614 2.06072V4.6187H12.7587V2.06072ZM6.24375 6.01396C3.79358 6.01396 1.82543 7.98257 1.82543 10.4286V13.2191C1.82543 14.8992 3.17278 16.2459 4.8485 16.2459H5.29478C5.76348 15.0255 6.9542 14.153 8.33664 14.153C9.71971 14.153 10.9069 15.026 11.3749 16.2459H22.0424C22.5132 15.0265 23.7007 14.153 25.0835 14.153C26.4662 14.153 27.6506 15.0265 28.118 16.2459H28.5679C30.2436 16.2459 31.591 14.8992 31.591 13.2191V10.4286C31.591 7.98257 29.6228 6.01396 27.1726 6.01396H6.24375ZM0.89526 10.4286C0.89526 7.46838 3.28032 5.08378 6.24375 5.08378H27.1726C30.1361 5.08378 32.5211 7.46838 32.5211 10.4286V13.2191C32.5211 15.4122 30.758 17.176 28.5679 17.176H27.4186L27.3287 16.827C27.0712 15.8272 26.1579 15.0831 25.0835 15.0831C24.0086 15.0831 23.0912 15.8279 22.8304 16.8283L22.7398 17.176H10.6755L10.5856 16.827C10.3283 15.8279 9.41264 15.0831 8.33664 15.0831C7.25991 15.0831 6.34109 15.8286 6.08395 16.827L5.99404 17.176H4.8485C2.65841 17.176 0.89526 15.4122 0.89526 13.2191V10.4286ZM0.89526 15.4915L1.6926 16.3055C2.50012 17.1299 3.61754 17.6411 4.8485 17.6411H5.99296L6.08361 17.9889C6.3444 18.9894 7.2609 19.734 8.33664 19.734C9.4083 19.734 10.3251 18.9897 10.586 17.9889L10.6766 17.6411H22.7398L22.8304 17.9889C23.0912 18.9893 24.0086 19.734 25.0835 19.734C26.1546 19.734 27.0688 18.9903 27.329 17.9892L27.4195 17.6411H28.5679C29.7997 17.6411 30.9169 17.133 31.7238 16.3092L32.5211 15.4952V22.9896C32.5211 25.9533 30.1363 28.3381 27.1726 28.3381H23.2311L23.1892 27.9194C22.8602 24.6374 20.0747 22.0594 16.7082 22.0594C13.3421 22.0594 10.5597 24.6371 10.2272 27.9199L10.1848 28.3381H6.24375C3.28009 28.3381 0.89526 25.9533 0.89526 22.9896V15.4915ZM8.33664 16.4784C7.81054 16.4784 7.40275 16.8857 7.40275 17.4086C7.40275 17.9285 7.81135 18.3387 8.33664 18.3387C8.85741 18.3387 9.26682 17.9293 9.26682 17.4086C9.26682 16.8849 8.85822 16.4784 8.33664 16.4784ZM6.47258 17.4086C6.47258 16.3688 7.30006 15.5482 8.33664 15.5482C9.37032 15.5482 10.197 16.3696 10.197 17.4086C10.197 18.4431 9.37113 19.2689 8.33664 19.2689C7.29925 19.2689 6.47258 18.4439 6.47258 17.4086ZM25.0835 16.4784C24.559 16.4784 24.1533 16.8841 24.1533 17.4086C24.1533 17.9302 24.5598 18.3387 25.0835 18.3387C25.601 18.3387 26.0062 17.9326 26.0062 17.4086C26.0062 16.8816 25.6018 16.4784 25.0835 16.4784ZM23.2231 17.4086C23.2231 16.3704 24.0453 15.5482 25.0835 15.5482C26.1204 15.5482 26.9364 16.3728 26.9364 17.4086C26.9364 18.4398 26.1212 19.2689 25.0835 19.2689C24.0445 19.2689 23.2231 18.4422 23.2231 17.4086ZM1.82543 17.6278V22.9896C1.82543 25.4396 3.79381 27.4079 6.24375 27.4079H9.35613C9.92073 23.8583 13.0023 21.1293 16.7082 21.1293C20.4135 21.1293 23.4991 23.8578 24.0607 27.4079H27.1726C29.6226 27.4079 31.591 25.4396 31.591 22.9896V17.631C30.7296 18.224 29.6882 18.5713 28.5679 18.5713H28.1174C27.648 19.7901 26.4644 20.6642 25.0835 20.6642C23.7007 20.6642 22.5132 19.7907 22.0424 18.5713H11.374C10.9034 19.7903 9.71721 20.6642 8.33664 20.6642C6.95298 20.6642 5.76625 19.7906 5.29558 18.5713H4.8485C3.72772 18.5713 2.68643 18.2216 1.82543 17.6278ZM16.7082 23.4547C13.8734 23.4547 11.5922 25.7391 11.5922 28.5707C11.5922 31.4053 13.8728 33.6829 16.7082 33.6829C19.5436 33.6829 21.8242 31.4053 21.8242 28.5707C21.8242 25.7391 19.543 23.4547 16.7082 23.4547ZM10.6621 28.5707C10.6621 25.2258 13.3592 22.5245 16.7082 22.5245C20.0572 22.5245 22.7543 25.2258 22.7543 28.5707C22.7543 31.9198 20.0566 34.6131 16.7082 34.6131C13.3599 34.6131 10.6621 31.9198 10.6621 28.5707Z"/>
            </g>
            <defs>
                <clipPath id="clip0_113_106">
                 <rect width="36" height="42.002" fill="white" transform="translate(0 -0.000976562)"/>
                </clipPath>
            </defs>
        </svg>, lists: [
            {li: 'Direct collaboration with us and your team.'},
            {li: 'Keep your platform running with no hassle.'},
            {li: 'Ready to collaborate in your timezone.'}
        ]},
        {title: 'Outsource', subTitle: 'software development', des: 'When you outsource your software project to our in-house engineers and product Managers, we take care of the development processes while you focus on other things that matter and never have to worry about the technical aspect of your business.', link: '/outsource', icons: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className='fa'>
            <path d="M7.14758 14.8571H5.51387C5.36231 14.8571 5.21697 14.9173 5.10981 15.0245C5.00264 15.1316 4.94244 15.277 4.94244 15.4285C4.94244 15.5801 5.00264 15.7254 5.10981 15.8326C5.21697 15.9397 5.36231 15.9999 5.51387 15.9999H7.14701C7.29856 15.9999 7.44391 15.9397 7.55107 15.8326C7.65823 15.7254 7.71844 15.5801 7.71844 15.4285C7.71844 15.277 7.65823 15.1316 7.55107 15.0245C7.44391 14.9173 7.29913 14.8571 7.14758 14.8571ZM11.0659 15.4285C11.0659 15.5801 11.1261 15.7254 11.2332 15.8326C11.3404 15.9397 11.4857 15.9999 11.6373 15.9999H13.2704C13.422 15.9999 13.5673 15.9397 13.6745 15.8326C13.7817 15.7254 13.8419 15.5801 13.8419 15.4285C13.8419 15.277 13.7817 15.1316 13.6745 15.0245C13.5673 14.9173 13.422 14.8571 13.2704 14.8571H11.6373C11.4857 14.8571 11.3404 14.9173 11.2332 15.0245C11.1261 15.1316 11.0659 15.277 11.0659 15.4285Z"/>
            <path d="M37.1424 1.71423H13.1424C12.5122 1.71423 11.9996 2.2268 11.9996 2.85709V11.9999H2.85672C2.22644 11.9999 1.71387 12.5125 1.71387 13.1428V37.1428C1.71387 37.7731 2.22644 38.2857 2.85672 38.2857H26.8567C27.487 38.2857 27.9996 37.7731 27.9996 37.1428V27.9999H37.1424C37.7727 27.9999 38.2853 27.4874 38.2853 26.8571V2.85709C38.2853 2.2268 37.7727 1.71423 37.1424 1.71423ZM26.8567 37.1428H2.85672V18.8571H26.8567V37.1428ZM26.8567 17.7142H2.85672V13.1428L26.8567 13.1411V17.7142ZM37.1424 26.8571H27.9996V13.1428C27.9996 12.5125 27.487 11.9999 26.8567 11.9999H13.1424V8.57138H37.1424V26.8571ZM37.1424 7.42852H13.1424V2.85709H37.1424V7.42852Z"/>
            <path d="M15.8002 5.71423H17.4333C17.5848 5.71423 17.7302 5.65403 17.8374 5.54687C17.9445 5.4397 18.0047 5.29436 18.0047 5.14281C18.0047 4.99125 17.9445 4.84591 17.8374 4.73874C17.7302 4.63158 17.5848 4.57138 17.4333 4.57138H15.7996C15.648 4.57138 15.5027 4.63158 15.3955 4.73874C15.2884 4.84591 15.2282 4.99125 15.2282 5.14281C15.2282 5.29436 15.2884 5.4397 15.3955 5.54687C15.5027 5.65403 15.6486 5.71423 15.8002 5.71423ZM21.923 5.71423H23.5562C23.7077 5.71423 23.8531 5.65403 23.9602 5.54687C24.0674 5.4397 24.1276 5.29436 24.1276 5.14281C24.1276 4.99125 24.0674 4.84591 23.9602 4.73874C23.8531 4.63158 23.7077 4.57138 23.5562 4.57138H21.923C21.7715 4.57138 21.6261 4.63158 21.5189 4.73874C21.4118 4.84591 21.3516 4.99125 21.3516 5.14281C21.3516 5.29436 21.4118 5.4397 21.5189 5.54687C21.6261 5.65403 21.7715 5.71423 21.923 5.71423ZM9.8813 31.8325C9.93424 31.8858 9.99719 31.928 10.0665 31.9569C10.1359 31.9857 10.2102 32.0005 10.2853 32.0005C10.3604 32.0005 10.4347 31.9857 10.5041 31.9569C10.5734 31.928 10.6364 31.8858 10.6893 31.8325C10.7964 31.7254 10.8566 31.58 10.8566 31.4285C10.8566 31.277 10.7964 31.1317 10.6893 31.0245L8.23615 28.5714L10.6893 26.1182C10.7439 26.0655 10.7874 26.0025 10.8174 25.9328C10.8473 25.863 10.8631 25.7881 10.8637 25.7122C10.8644 25.6363 10.8499 25.5611 10.8212 25.4908C10.7925 25.4206 10.75 25.3568 10.6964 25.3032C10.6427 25.2495 10.5789 25.2071 10.5087 25.1783C10.4385 25.1496 10.3632 25.1351 10.2874 25.1358C10.2115 25.1365 10.1365 25.1522 10.0668 25.1822C9.99706 25.2121 9.93401 25.2557 9.8813 25.3102L7.02415 28.1674C6.91703 28.2745 6.85685 28.4199 6.85685 28.5714C6.85685 28.7229 6.91703 28.8682 7.02415 28.9754L9.8813 31.8325ZM19.0242 31.8325C19.0771 31.8858 19.14 31.928 19.2094 31.9569C19.2787 31.9857 19.3531 32.0005 19.4282 32.0005C19.5032 32.0005 19.5776 31.9857 19.6469 31.9569C19.7163 31.928 19.7792 31.8858 19.8322 31.8325L22.6893 28.9754C22.7964 28.8682 22.8566 28.7229 22.8566 28.5714C22.8566 28.4199 22.7964 28.2745 22.6893 28.1674L19.8322 25.3102C19.7794 25.2557 19.7164 25.2121 19.6467 25.1822C19.577 25.1522 19.502 25.1365 19.4261 25.1358C19.3502 25.1351 19.275 25.1496 19.2048 25.1783C19.1345 25.2071 19.0707 25.2495 19.0171 25.3032C18.9634 25.3568 18.921 25.4206 18.8923 25.4908C18.8635 25.5611 18.8491 25.6363 18.8497 25.7122C18.8504 25.7881 18.8661 25.863 18.8961 25.9328C18.926 26.0025 18.9696 26.0655 19.0242 26.1182L21.4773 28.5714L19.0242 31.0245C18.917 31.1317 18.8568 31.277 18.8568 31.4285C18.8568 31.58 18.917 31.7254 19.0242 31.8325ZM12.0516 34.8542C12.12 34.885 12.1938 34.9019 12.2688 34.9041C12.3438 34.9063 12.4185 34.8937 12.4886 34.867C12.5587 34.8403 12.6228 34.8 12.6774 34.7485C12.7319 34.697 12.7758 34.6353 12.8064 34.5668L17.9493 23.0908C17.98 23.0224 17.9969 22.9486 17.9991 22.8736C18.0012 22.7986 17.9886 22.7239 17.9619 22.6538C17.9352 22.5838 17.895 22.5196 17.8435 22.4651C17.792 22.4105 17.7303 22.3666 17.6619 22.3359C17.5934 22.3053 17.5196 22.2883 17.4446 22.2862C17.3697 22.284 17.295 22.2966 17.2249 22.3233C17.1548 22.35 17.0907 22.3903 17.0361 22.4417C16.9816 22.4932 16.9377 22.5549 16.907 22.6234L11.7642 34.0994C11.7334 34.1678 11.7165 34.2416 11.7143 34.3166C11.7121 34.3916 11.7247 34.4663 11.7514 34.5364C11.7781 34.6065 11.8184 34.6706 11.8699 34.7252C11.9214 34.7797 11.9831 34.8236 12.0516 34.8542Z"/>
            <path d="M7.14758 14.8571H5.51387C5.36231 14.8571 5.21697 14.9173 5.10981 15.0245C5.00264 15.1316 4.94244 15.277 4.94244 15.4285C4.94244 15.5801 5.00264 15.7254 5.10981 15.8326C5.21697 15.9397 5.36231 15.9999 5.51387 15.9999H7.14701C7.29856 15.9999 7.44391 15.9397 7.55107 15.8326C7.65823 15.7254 7.71844 15.5801 7.71844 15.4285C7.71844 15.277 7.65823 15.1316 7.55107 15.0245C7.44391 14.9173 7.29913 14.8571 7.14758 14.8571ZM11.0659 15.4285C11.0659 15.5801 11.1261 15.7254 11.2332 15.8326C11.3404 15.9397 11.4857 15.9999 11.6373 15.9999H13.2704C13.422 15.9999 13.5673 15.9397 13.6745 15.8326C13.7817 15.7254 13.8419 15.5801 13.8419 15.4285C13.8419 15.277 13.7817 15.1316 13.6745 15.0245C13.5673 14.9173 13.422 14.8571 13.2704 14.8571H11.6373C11.4857 14.8571 11.3404 14.9173 11.2332 15.0245C11.1261 15.1316 11.0659 15.277 11.0659 15.4285Z"/>
            <path d="M37.1424 1.71423H13.1424C12.5122 1.71423 11.9996 2.2268 11.9996 2.85709V11.9999H2.85672C2.22644 11.9999 1.71387 12.5125 1.71387 13.1428V37.1428C1.71387 37.7731 2.22644 38.2857 2.85672 38.2857H26.8567C27.487 38.2857 27.9996 37.7731 27.9996 37.1428V27.9999H37.1424C37.7727 27.9999 38.2853 27.4874 38.2853 26.8571V2.85709C38.2853 2.2268 37.7727 1.71423 37.1424 1.71423ZM26.8567 37.1428H2.85672V18.8571H26.8567V37.1428ZM26.8567 17.7142H2.85672V13.1428L26.8567 13.1411V17.7142ZM37.1424 26.8571H27.9996V13.1428C27.9996 12.5125 27.487 11.9999 26.8567 11.9999H13.1424V8.57138H37.1424V26.8571ZM37.1424 7.42852H13.1424V2.85709H37.1424V7.42852Z"/>
            <path d="M15.8002 5.71423H17.4333C17.5848 5.71423 17.7302 5.65403 17.8374 5.54687C17.9445 5.4397 18.0047 5.29436 18.0047 5.14281C18.0047 4.99125 17.9445 4.84591 17.8374 4.73874C17.7302 4.63158 17.5848 4.57138 17.4333 4.57138H15.7996C15.648 4.57138 15.5027 4.63158 15.3955 4.73874C15.2884 4.84591 15.2282 4.99125 15.2282 5.14281C15.2282 5.29436 15.2884 5.4397 15.3955 5.54687C15.5027 5.65403 15.6486 5.71423 15.8002 5.71423ZM21.923 5.71423H23.5562C23.7077 5.71423 23.8531 5.65403 23.9602 5.54687C24.0674 5.4397 24.1276 5.29436 24.1276 5.14281C24.1276 4.99125 24.0674 4.84591 23.9602 4.73874C23.8531 4.63158 23.7077 4.57138 23.5562 4.57138H21.923C21.7715 4.57138 21.6261 4.63158 21.5189 4.73874C21.4118 4.84591 21.3516 4.99125 21.3516 5.14281C21.3516 5.29436 21.4118 5.4397 21.5189 5.54687C21.6261 5.65403 21.7715 5.71423 21.923 5.71423ZM9.8813 31.8325C9.93424 31.8858 9.99719 31.928 10.0665 31.9569C10.1359 31.9857 10.2102 32.0005 10.2853 32.0005C10.3604 32.0005 10.4347 31.9857 10.5041 31.9569C10.5734 31.928 10.6364 31.8858 10.6893 31.8325C10.7964 31.7254 10.8566 31.58 10.8566 31.4285C10.8566 31.277 10.7964 31.1317 10.6893 31.0245L8.23615 28.5714L10.6893 26.1182C10.7439 26.0655 10.7874 26.0025 10.8174 25.9328C10.8473 25.863 10.8631 25.7881 10.8637 25.7122C10.8644 25.6363 10.8499 25.5611 10.8212 25.4908C10.7925 25.4206 10.75 25.3568 10.6964 25.3032C10.6427 25.2495 10.5789 25.2071 10.5087 25.1783C10.4385 25.1496 10.3632 25.1351 10.2874 25.1358C10.2115 25.1365 10.1365 25.1522 10.0668 25.1822C9.99706 25.2121 9.93401 25.2557 9.8813 25.3102L7.02415 28.1674C6.91703 28.2745 6.85685 28.4199 6.85685 28.5714C6.85685 28.7229 6.91703 28.8682 7.02415 28.9754L9.8813 31.8325ZM19.0242 31.8325C19.0771 31.8858 19.14 31.928 19.2094 31.9569C19.2787 31.9857 19.3531 32.0005 19.4282 32.0005C19.5032 32.0005 19.5776 31.9857 19.6469 31.9569C19.7163 31.928 19.7792 31.8858 19.8322 31.8325L22.6893 28.9754C22.7964 28.8682 22.8566 28.7229 22.8566 28.5714C22.8566 28.4199 22.7964 28.2745 22.6893 28.1674L19.8322 25.3102C19.7794 25.2557 19.7164 25.2121 19.6467 25.1822C19.577 25.1522 19.502 25.1365 19.4261 25.1358C19.3502 25.1351 19.275 25.1496 19.2048 25.1783C19.1345 25.2071 19.0707 25.2495 19.0171 25.3032C18.9634 25.3568 18.921 25.4206 18.8923 25.4908C18.8635 25.5611 18.8491 25.6363 18.8497 25.7122C18.8504 25.7881 18.8661 25.863 18.8961 25.9328C18.926 26.0025 18.9696 26.0655 19.0242 26.1182L21.4773 28.5714L19.0242 31.0245C18.917 31.1317 18.8568 31.277 18.8568 31.4285C18.8568 31.58 18.917 31.7254 19.0242 31.8325ZM12.0516 34.8542C12.12 34.885 12.1938 34.9019 12.2688 34.9041C12.3438 34.9063 12.4185 34.8937 12.4886 34.867C12.5587 34.8403 12.6228 34.8 12.6774 34.7485C12.7319 34.697 12.7758 34.6353 12.8064 34.5668L17.9493 23.0908C17.98 23.0224 17.9969 22.9486 17.9991 22.8736C18.0012 22.7986 17.9886 22.7239 17.9619 22.6538C17.9352 22.5838 17.895 22.5196 17.8435 22.4651C17.792 22.4105 17.7303 22.3666 17.6619 22.3359C17.5934 22.3053 17.5196 22.2883 17.4446 22.2862C17.3697 22.284 17.295 22.2966 17.2249 22.3233C17.1548 22.35 17.0907 22.3903 17.0361 22.4417C16.9816 22.4932 16.9377 22.5549 16.907 22.6234L11.7642 34.0994C11.7334 34.1678 11.7165 34.2416 11.7143 34.3166C11.7121 34.3916 11.7247 34.4663 11.7514 34.5364C11.7781 34.6065 11.8184 34.6706 11.8699 34.7252C11.9214 34.7797 11.9831 34.8236 12.0516 34.8542Z"/>
        </svg>},
    ];

    const services = [    
        {title: <h4>“All your <span>technical needs covered </span> under a single monthly subscription.”</h4>, buttonText: "Outsource", buttonFunction: '/outsource'},
        {title: <h4>“<span>Seamlessly Hire</span>, Onboard, Manage and Pay your employees and contractors all-in-one platform.”</h4>, buttonText: 'Hire talents', buttonFunction: '/hire'},
        {title: <h4>“Directly connecting <span>remote workers</span> with employers offering remote job listings.”</h4>, buttonText: 'Apply for Remote Jobs', buttonFunction: '/jobs'}
    ];

    const testimonals = [
        {info: "“As a seasoned sales professional, I've used various platforms to explore job opportunities in the past, but none have impressed me as much as this one. The platform's user-friendly interface, coupled with its extensive network of employers, made it stand out from the crowd.”", name: 'Ngozi Onwuka', role: 'Sales Manager'},
        {info: "“This platform streamlined our hiring process, delivering top talent efficiently. Its intuitive interface and personalized job matches were game-changers. Thanks to this platform, I landed my dream job at a reputable tech company, and I couldn't be happier with the outcome.”", name: 'Chika Okoro', role: 'Marketing Manager'},
        {info: "“Managing recruitment processes for a large organization can be quite daunting, but this platform has been a game-changer for us. The robust suite of tools and features provided has significantly streamlined our hiring operations and improved our overall efficiency.”", name: 'Ibrahim Abubakar', role: ' Human Resources Manager'},
        {info: "“Transitioning to a new role in the finance industry can be quite challenging, especially when navigating through countless job listings and competing with other qualified candidates. However, this platform made the job search process a breeze for me.”", name: 'Temitope Adekunle', role: 'Financial Analyst'},
    ];

    const faqs = [
        {ques: 'How much does Pedxo charge?', ans: 'To keep your platform running, you would have to make a subscription billed monthly. No equity.'},
        {ques: 'What is the timeframe for project delivery?', ans: 'Building an MVP takes continuous testing and iteration to succesfully come up with a working product that your users can interact with, in the process there is no guaranteed date for project completion.', con: 'But it takes atleast 3 months to create an effective technology for an MVP depending on your industry.'},
        {ques: 'How to start working with Pedxo?', ans: 'To hire Pedxo is very simple. Below are the steps to follow;', lists: [
            {listAns: 'Talk with our team about your idea, market and challenges.'},
            {listAns: 'We sign an NDA if required, to maintain high level of privacy.'},
            {listAns: "After intensive project review and paperwork, we’ll come back with a hand picked engineers whose skills and experience are best align with your needs."},
        ], con: 'Once approved, the team assigned to your project will start working and sending you updates regularly'},
        {ques: 'What is an MVP and why is it so important?', ans: "An MVP stands for Minimum Viable Product. It's the simplest version of a product that can be released to market with just the core features necessary to satisfy early adopters. It's important because it allows teams to validate their idea with real users, gather feedback, and iterate based on that feedback before investing heavily in development."},
        {ques: 'Why choose Pedxo?', lists: [
            {listAns: 'Speed:- Faster execution and design iteration process.'},
            {listAns: 'Quality:- A highly testing and tech update.'},
            {listAns: 'Cost:- The same price for a full time hire (employee) or agency.'},
            {listAns: 'Strategies:- We have the strategy in place to make you launch faster and gain traction with a minimal resources.'}
        ]}
    ];

    useEffect(() => {

        const dCount = setInterval(() => {
            
            if(devCount < 2000){
                setDevCount(prevCount => prevCount + 10)
            } else {
                return
            }

        }, 10);

        const desCount = setInterval(() => {
            
            if(designCount < 900){
                setDesignCount(prevCount => prevCount + 10)
            } else {
                return
            }

        }, 10);

        const conCount = setInterval(() => {
            
            if(contractCount < 500){
                setContractCount(prevCount => prevCount + 10)
            } else {
                return
            }

        }, 10);

        document.title = 'Tech-outsourcing, HR and MVP development company';

        return () => {
            clearInterval(dCount);
            clearInterval(desCount);
            clearInterval(conCount);
        }
    }, [devCount, designCount, contractCount]);


    return (
        <div className='body'>
            <Header />
            <section className='position-relative overflow-hidden col-12 hero'>
                <div className='d-flex align-items-center overflow-hidden col-12 h-100 sub-hero-sec'>
                    <div className='inner-hero-sec'>
                        <div className='svg-holder'>
                            <div className='left-svg'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="787" viewBox="0 0 1440 787" fill="none">
                                    <g mix-blend-mode='plus-lighter' opacity="0.3">
                                        <path d="M334.61 97.648C-41.9301 -209.482 -303.937 178.002 -387.942 410.286C-387.981 410.395 -388 410.506 -388 410.622V792.299C-388 792.845 -387.591 793.29 -387.045 793.299C242.061 803.452 1516.46 829.174 1563.94 804.844C1623.31 774.416 805.393 481.648 334.61 97.648Z" fill="url(#paint0_linear_101_340)" fill-opacity="0.2"/>
                                    </g>
                                    <defs>
                                        <linearGradient id="paint0_linear_101_340" x1="686.987" y1="137.946" x2="667.308" y2="855.822" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#F9CC67"/>
                                            <stop offset="1" stop-color="#EFCE8A" stop-opacity="0"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className='right-svg'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="637" viewBox="0 0 1440 637" fill="none">
                                    <g mix-blend-mode="plus-lighter" opacity="0.3" filter="url(#filter0_i_101_341)">
                                        <path d="M1004.19 92.9971C1311 -158.312 1524.48 158.718 1592.94 348.798C1592.98 348.906 1593 349.017 1593 349.132V661.239C1593 661.787 1592.59 662.233 1592.04 662.238C1079.19 666.996 28.9806 664 -2 664C-12.5 664 620.583 407.221 1004.19 92.9971Z" fill="url(#paint0_linear_101_341)" fill-opacity="0.15"/>
                                    </g>
                                    <defs>
                                        <filter id="filter0_i_101_341" x="-2.12891" y="0" width="1595.13" height="668.931" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                                    <feOffset dy="4"/>
                                                    <feGaussianBlur stdDeviation="17.6"/>
                                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                                <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.843137 0 0 0 0 0.415686 0 0 0 0.2 0"/>
                                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_101_341"/>
                                        </filter>
                                            <linearGradient id="paint0_linear_101_341" x1="717.064" y1="125.973" x2="733.236" y2="713.401" gradientUnits="userSpaceOnUse">
                                                <stop stop-color="#F9CC67"/>
                                            <stop offset="1" stop-color="#EFCE8A" stop-opacity="0"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                        <div className='position-absolute d-flex align-items-center justify-content-center top-0 start-0 col-12 h-100 hero-text-holder'>
                            <div className='d-inline-flex flex-column align-items-center gap-4 hero-text-con'>
                                <div className='d-flex flex-column align-items-center gap-3 col-12 hero-text-hld'>
                                    <div className='heading'>
                                        <h4>Technical <br /> partner-as-a-service.</h4>
                                    </div>
                                    <div className='col-12 col-lg-7 par'>
                                        <p>Pedxo work as your in house developers to help build up your MVP, eliminating the need for you to hire an external engineering team.</p>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center justify-content-center gap-4 flex-lg-row flex-column col-12 p-lg-0 py-1 px-2 hero-links-hld'>
                                    <div className='col-12 col-lg-4 first-link'>
                                        <Link to='/outsource' className='d-flex align-items-center justify-content-center gap-2 text-decoration-none link'>
                                            <p className='text'>Outsource Project</p>
                                            <FaArrowRight className='fa' />
                                        </Link>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-center gap-2 second-link'>
                                        <Link to='/request-a-demo' className='link'>Book a demo</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='d-flex align-items-center justify-content-center metrix col-12'>
                <div className='d-flex align-items-center justify-content-center col-12 flex-lg-row flex-column m-0 container'>
                    <div className='d-flex flex-lg-row flex-column align-items-center justify-content-center col-12 metrix-holder-con'>
                        <div className='d-flex flex-column gap-lg-2 gap-0 justify-content-center justify-content-lg-between metrix-dev'>
                            <div className='d-flex align-items-center gap-1 justify-content-center justify-content-lg-left metrix-dev-count'>
                                <h2>{devCount}</h2>
                                <FaPlus />
                            </div>
                            <div className='metrix-dev-des'>
                                <p>Developers <br/> join every month</p>
                            </div>
                        </div>
                        <div className='d-flex flex-column gap-lg-2 gap-0 justify-content-center justify-content-lg-between metrix-design'>
                            <div className='d-flex align-items-center gap-1 justify-content-center justify-content-lg-left metrix-design-count'>
                                <h2>{designCount}</h2>
                                <FaPlus />
                            </div>
                            <div className='metrix-design-des'>
                                <p>Designers <br/> join every month</p>
                            </div>
                        </div>
                        <div className='d-flex flex-column gap-lg-2 gap-0 justify-content-center justify-content-lg-between metrix-contract'>
                            <div className='d-flex align-items-center gap-1 justify-content-center justify-content-lg-left metrix-contract-count'>
                                <h2>{contractCount}</h2>
                                <FaPlus />
                            </div>
                            <div className='metrix-contract-des'>
                                <p>Contractors <br/> join every month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="about-sec p-5 w-100 bg-white" id='about'>
                <div className="container my-lg-4 m-0 col-12 sub-abt-sec">
                    <div className="row align-items-center justify-content-center">
                        <div className="d-flex flex-column justify-content-left gap-4 col-4 col-lg-6 abt-txt-sec">
                            <div className="d-flex align-items-center gap-2 col-12 abt-in">
                                <div className="abt-in-bdr"></div>
                                <div className="abt-in-title">
                                    <h4>About us</h4>
                                </div>
                            </div>
                            <div className='d-flex flex-column justify-content-left gap-3 abt-info-sec'>
                                <div className='abt-info-title'>
                                    <h2>Your startup’s <span>technical department </span> on subscription.</h2>
                                </div>
                                <div className='abt-info-par'>
                                    <p>Outsource the technology of your startup to us, let's help you to launch and continuously iterate your software.</p>
                                </div>
                                <div className='d-flex mb-3 gap-3 abt-info-btn-hld'>
                                    <div className='book'>
                                        <button className='d-flex align-items-center justify-content-center gap-2' onClick={() => bookDemo()}>
                                           <p>Book demo</p> 
                                           <FaArrowRight className='fa' />
                                        </button>
                                    </div>
                                    <div className='read'>
                                        <Link className='d-flex align-items-center justify-content-center read-link' to='https://nairametrics.com/2023/10/16/the-mvp-important-aspects-to-consider-in-your-start-ups-online-business-process' target='_blank' rel='noreferrer'>
                                            <p>Read about us on Nairametrics</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='abt-img-hld col-4 col-lg-4 d-flex items-center justify-content-center'>
                            <div className='img-sec'>
                                <img className='img-fluid' src={aboutImg} alt=''></img>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='remote-work p-5'>
                <div className='d-flex align-items-center justify-content-center my-4 sub-remote-work'>
                    <div className='inner-remote-work container'>
                        <div className='d-flex flex-column align-items-start gap-4 col-12 remote-work-content'>
                            <div className='first-content'>
                                <div className='d-flex align-items-center gap-2 sub-first-content'>
                                    <div className='border'></div>
                                    <div className='text-uppercase title'>
                                        <h4 className='fs-6'>Remote work simplified.</h4>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex flex-column gap-5 second-content'>
                                <div className='d-flex flex-column gap-3 second-content-heading'>
                                    <div className='col-12 col-xl-7 col-lg-9'>
                                        <h2>Bring your <span>idea</span> <span className='to'>to market quickly</span> <span>with minimal resources</span></h2>
                                    </div>
                                    <div className='col-12 col-xl-8 col-lg-9'>
                                        <p className='fs-6 fw-normal'>You don't need to hire a CTO, product manager and data scientist at the early stage of your startup. We cover all of that for you as long as possible under a single subscription billed monthly.</p>
                                    </div>
                                </div>
                                <div className='second-content-items'>
                                    {remoteInfos.map((remoteInfo) => (
                                        <div className='sub-content'>
                                            <div className='d-flex align-items-center gap-2 heading'>
                                                {remoteInfo.icons}
                                                <h5 className='text-capitalize'>{remoteInfo.title}<br/> <span>{remoteInfo.subTitle}</span></h5>
                                            </div>
                                            <div className='positive-relative d-flex flex-column align-items-center justify-content-between gap-4 paragraph'>
                                                <div className='d-flex flex-column align-items-center justify-content-left gap-2 par-des'>
                                                    <p>{remoteInfo.des}</p>
                                                    <div className='des-list'>
                                                        {remoteInfo.lists && (
                                                            <ul className='ps-lg-3 ps-4'>
                                                                {remoteInfo.lists.map((subInfo, index) => (
                                                                    <li key={index}>{subInfo.li}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link to={remoteInfo.link} className='positive-relative d-flex align-items-center justify-content-center text-decoration-none col-12 rounded-2 par-icon'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className='fa'>
                                                        <path d="M21.1863 9.28003L27.1862 15.28L27.9062 16L27.1862 16.72L21.1863 22.72L19.7803 21.28L24.0633 17H3.99925V15H24.0623L19.7803 10.72L21.1883 9.28003H21.1863Z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='position-relative overflow-hidden p-5 w-100 services' id='services'>
                <div className='sub-service-holder bg-transparent'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 500" fill="none" className='position-relative svg-design'>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M837.008 122.85C794.743 133.036 761.249 153.249 714.781 203.656C679.537 241.887 676.755 285.46 672.199 356.819L672.065 358.923C667.635 428.252 660.222 517.324 582.762 595.846C498.371 681.393 405.813 692.729 332.123 701.754C321.478 703.057 311.226 704.313 301.45 705.737C261.445 711.564 227.218 719.602 194.599 738.583C162.476 757.276 128.026 788.926 92.6082 848L0 788.902C43.3253 716.64 90.3106 670.29 141.102 640.733C191.399 611.465 241.567 601.004 286.226 594.498C298.578 592.699 310.409 591.155 321.796 589.668C395.115 580.097 449.997 572.932 506.443 515.713C552.674 468.848 559.139 418.351 563.408 351.534C563.664 347.531 563.908 343.429 564.157 339.237C567.86 276.886 572.741 194.721 635.876 126.234C692.341 64.9836 743.588 29.9974 812.238 13.4533C873.653 -1.34719 947.31 -0.547472 1043.68 0.498852C1046.76 0.532329 1049.87 0.566057 1053 0.599537L1051.87 112.936C945.211 111.795 884.542 111.395 837.008 122.85Z" fill="#E7BB3F"/>
                    </svg>
                    <div className='position-absolute overflow-hidden start-0 top-0 col-12 services-holder'>
                        <div className='services-content-holder'>
                            <Slider {...serviceSlide}>
                                {services.map((service) => (
                                    <div className='d-flex flex-column align-items-center justify-content-center service-content'>
                                        <div className='d-flex align-items-center justify-content-center text-center col-10 text-center services-text'>
                                            {service.title}
                                        </div>
                                        <div className='service-button-holder'>
                                            <Link to={service.buttonFunction} className='d-flex align-items-center justify-content-center text-decoration-none'>
                                                <p>{service.buttonText}</p>
                                                <FaArrowRight className='fa' />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
            <section className='d-flex align-items-center justify-content-center overflow-hidden p-5 testimonals'>
                <div className='tes-hld col-12 my-3 mx-0'>
                    <div className='in-tes'>
                        <div className='d-flex align-items-start justify-content-center flex-column col-12 gap-5 sub-tes'>
                            <div className='d-flex align-items-start flex-column tes-hd-con container'>
                                <div className='sub-tes-hld'>
                                    <div className='d-flex align-items-center col-12 gap-2 sub-tes-sec'>
                                        <div className='sub-tes-bdr'></div>
                                        <div className='seb-tes-txt'>
                                            <h4>Testimonals</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className='sub-tes-hd'>
                                    <h2>What our <span>Clients</span> say</h2>
                                </div>
                            </div>
                            <div className='tes-cont-bdy'>
                                <Slider {...testimonal}>
                                    {testimonals.map((testimonal) => (
                                        <div className='d-flex align-items-start p-4 gap-2 sub-tes-con'>
                                            <div className='d-flex align-items-start flex-column gap-5 in-tes-con'>
                                                <div className='tes-con-info'>
                                                    <p>{testimonal.info}</p>
                                                </div>
                                                <div className='tes-con-name'>
                                                    <h4>{testimonal.name}</h4>
                                                    <h6>{testimonal.role}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='col-12 faq p-5' id='faq'>
                <div className='sub-faq-sec my-5'>
                    <div className='inner-faq-sec d-flex align-items-start flex-column container'>
                        <div className='faq-hld d-flex align-items-start flex-column gap-5 col-12'>
                            <div className='faq-heading d-flex align-items-center gap-2'>
                                <div className='faq-border'></div>
                                <div className='faq-heading-sec'>
                                    <h4 className='fs-6'>FAQ's</h4>
                                </div>
                            </div>
                            <div className='faq-ques-hld d-flex align-items-start flex-column gap-4 col-12'>
                                <div className='faq-ques-head'>
                                    <h2>We've <span>answered</span> your questions</h2>
                                </div>
                                <div className='faq-ques-sec col-12'>
                                    <div className='sub-faq-ques d-flex align-items-start flex-column gap-3 gap-lg-4 col-12'>
                                        {faqs.map((faq, i) => (
                                            <div className='in-faq-ques d-flex align-items-start justify-content-center flex-column gap-3 py-3 px-4 col-12' key={i}>
                                                <div className='faq-ques-head d-flex justify-content-between align-items-center pe-auto col-12' onClick={() => selectedFaq(i)}>
                                                    <h3>{faq.ques}</h3>
                                                    <div className='icon-holder d-flex align-items-center justify-content-center position-relative rounded-circle'>
                                                        {activeFaq === i ? <FaTimes className='faPlus position-absolute fs-5' /> : <FaPlus className='faPlus position-absolute fs-5' />}
                                                    </div>
                                                </div>
                                                <div className={activeFaq === i ? 'faq-ques-body open' : 'faq-ques-body'}>
                                                    <div className='des fw-normal fs-6'>
                                                        <p>{faq.ans}</p>
                                                        {faq.lists && (
                                                            <ol className='des-list'>
                                                                {faq.lists.map((subfaq, index) => (
                                                                    <li key={index}>{subfaq.listAns}</li>
                                                                ))}
                                                            </ol>
                                                        )}
                                                        <p>{faq.con}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='position-relative overflow-hidden w-100 buld'>
                <div className='d-inline-flex flex-column align-items-start gap-2 col-12 h-100 buld-sec'>
                    <div className='d-flex align-items-center justify-content-center col-12 h-100 buld-sec-hld'>
                        <div className='in-buld-sec'>
                            <div className='position-relative d-flex flex-column align-items-end justify-content-between p-2 buld-des-hld'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1020" height="382" viewBox="0 0 1020 382" fill="none">
                                    <path d="M1152 459C971.837 263.957 767.043 385.741 581.954 263.958C440.453 170.854 550.199 56.6881 432.405 -26.2502C314.651 -109.16 238.519 -108.224 0.999985 -106.576" stroke="url(#paint0_linear_101_625)" strokeWidth="121"/>
                                    <defs>
                                        <linearGradient id="paint0_linear_101_625" x1="576.5" y1="459" x2="442.5" y2="18.5" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#383E49" stop-opacity="0.26"/>
                                            <stop offset="1" stop-color="#8695AF" stop-opacity="0.15"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className='position-absolute d-flex flex-column align-items-center justify-content-center gap-4 start-0 top-0 col-12 h-100 buld-sec-text'>
                                <div className='d-flex flex-column align-items-center text-center gap-2'>
                                    <h4>Building the next big thing?</h4>
                                    <p>Start by validating your idea with an MVP first.</p>
                                </div>
                                <button className='d-flex align-items-center justify-content-center gap-2 link-button' onClick={bookDemo}>
                                    <p>Get Started</p>
                                    <FaArrowRight className='fa' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

            <Outlet />
        </div>
    )
}