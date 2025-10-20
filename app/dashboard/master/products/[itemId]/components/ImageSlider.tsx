"use client"
import React from 'react';
import Image from "next/image";
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
import {Swiper, SwiperSlide} from "swiper/react";

const ImageSlider = ({images}:{images:[{url:string,file:string}]}) => {
    return (
        <Swiper
            spaceBetween={10}
            slidesPerView={1}
            modules={[Pagination]}
            className="text-sm"
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            {images.map((image, index) => (
                <SwiperSlide key={index}>
                    <Image
                        src={image.url}
                        alt={image.file}
                        layout="fill"
                        objectFit="cover"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ImageSlider;