import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import Image from "next/image";
import {Pagination} from "swiper/modules";


import 'swiper/css';
import 'swiper/css/pagination';

const ImagesSlider = ({images}: { images: string[] }) => {
    console.log(images);
    return (
        <>
            <Swiper pagination={{type: "fraction"}} modules={[Pagination]}>
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Image width={300} height={300} src={image.url} alt={image.file}
                               className="w-full bg-contain bg-center rounded-t-lg"/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default ImagesSlider;