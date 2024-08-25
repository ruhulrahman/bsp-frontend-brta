import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import HeroSlider from './HeroSlider';
import slider4 from '@/assets/images/slider/slider-4.jpg';
import slider6 from '@/assets/images/slider/slider-6.jpg';
import LoginBackground from '@/assets/images/login-background.png';
import { withNamespaces } from 'react-i18next';

const HeroContent = ({ t }) => {

    return (
        <div className="flex flex-col md:flex-row max-h-[500px] bg-gray-100 mt-3">
            {/* Left Content */}
            <div className="md:w-1/2 flex flex-col justify-center p-8 bg-white">
                {/* <h1 className="text-3xl font-bold text-center mb-4 text-green-500">বিআরটিএ সার্ভিস পোর্টালে স্বাগতম</h1> */}
                <h1 className="text-3xl font-bold text-center mb-4 text-green-500">{t('welcome_to_brta')}</h1>
                <p className="text-justify leading-7">{t('hero_content')}</p>
            </div>

            {/* Right Content (Slider) */}
            <div className="md:w-1/2 p-8">
                <img src={slider6} className='w-full max-h-[100%]' alt="Third slide" />
                {/* <HeroSlider /> */}
            </div>
        </div>
    );
};

export default withNamespaces()(HeroContent);
