'use client'

import Link from "next/link";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination'

import styles from './index.module.scss'

export default function ({data}: { data: API.Banners[] }) {

    return (
        <div className={styles.main}>
            <Swiper
                loop={data.length > 1}
                autoplay={{
                    delay: 5000,
                }}
                pagination={{
                    enabled: true,
                    bulletClass: styles.paginate,
                    bulletActiveClass: styles.paginate_active,
                }}
                modules={[Autoplay, Pagination]}
                className={styles.swiper}
            >
                {
                    data.map(item => (
                        <SwiperSlide key={item.id} className={styles.item}
                                     style={{backgroundImage: `url("${item.picture}")`}}>
                            <div className={styles.title}>{item.name}</div>
                            <div className={styles.description}>{item.description}</div>
                            {
                                item.url &&
                                <div className={styles.btn}>
                                    <Link href={item.url} target={item.target}>{item.button}</Link>
                                </div>
                            }
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}