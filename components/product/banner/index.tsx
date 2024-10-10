'use client'

import {useState} from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Thumbs} from 'swiper/modules';
import 'swiper/css';

import styles from './index.module.scss';

export default function ({pictures}: { pictures: string[] }) {

    const [thumb, setThumb] = useState<any>(null);

    return (
        <div className={styles.main}>
            <Swiper
                loop={pictures.length > 1}
                thumbs={{swiper: thumb}}
                modules={[Thumbs]}
                className={styles.swiper}
            >
                {
                    pictures.map((item,idx) => (
                        <SwiperSlide key={idx} className={styles.item}>
                            <img src={item} alt=''/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <Swiper
                spaceBetween={20}
                slidesPerView={4}
                onSwiper={setThumb}
                modules={[Autoplay, Thumbs]}
                className={styles.thumb}
            >
                {
                    pictures.map((item,idx) => (
                        <SwiperSlide key={idx} className={styles.item}>
                            <img src={item} alt=''/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}