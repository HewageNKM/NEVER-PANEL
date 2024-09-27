import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from "next/image";
import {Navigation} from "swiper/modules";

const ImagesSlider = ({images}: { images: string[] }) => {
    return (
        <>
            <Swiper modules={[Navigation]} navigation={true}
                    className="md:w-[20rem] md:h-[20rem] h-[17rem] w-[17rem] relative">
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Image width={300} height={300} src={image} alt={"image"}
                               className="w-full bg-contain bg-center rounded-t-lg"/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default ImagesSlider;