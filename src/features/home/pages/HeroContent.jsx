import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import HeroSlider from './HeroSlider';
import slider4 from '@/assets/images/slider/slider-4.jpg';
import slider6 from '@/assets/images/slider/slider-6.jpg';
import LoginBackground from '@/assets/images/login-background.png';
import { withTranslation, useTranslation } from 'react-i18next';
import carDrive from '@/assets/images/home/car-drive.png';

const HeroContent = () => {
const { t } = useTranslation();

    return (
        <div className="container-fluid bg-[#405869] text-white lg:max-h-[395px] 3xl:h-auto">
            <div className="row py-2">
                <div className="col-md-12">
                    <div className="sm:flex-col xs:flex xs:flex-col lg:flex-row">
                        <div className="flex-none z-[49] xs:max-w-[200px] md:max-w-[350px] lg:max-w-[400px] xl:max-w-[600px] mx-auto">
                            <img src={carDrive} className="w-full xs:mx-auto xs:mb-[50px] md:w-full" alt="Card photo" />
                        </div>
                        <div className="flex-1 my-auto mx-auto lg:max-w-[800px] xl:max-w-[1000px] 3xl:max-w-[1500px] 4xl:max-w-[2500px]">
                            <p className="text-justify xl:mt-[-100px] 3xl:mt-[-120px] 3xl:text-[40px]  lg:text-[25px] md:text-[20px] md:leading-2">{t('hero_content')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default (HeroContent);
