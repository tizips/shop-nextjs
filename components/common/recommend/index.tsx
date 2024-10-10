'use client'

import {useEffect, useState} from "react";
import Link from "next/link";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/pagination';

import styles from './index.module.scss';

export default function ({data}: { data: API.Products[] }) {

    const [collapsed, setCollapsed] = useState(false);

    const onResize = () => {
        if (window.document.documentElement.clientWidth <= 768) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }

    useEffect(() => {

        onResize()

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);

    return (
        <div className={styles.main}>
            <Swiper
                loop={(data.length) > (collapsed ? 2 : 5)}
                spaceBetween={30}
                slidesPerView={collapsed ? 2 : 5}
                pagination={{
                    enabled: true,
                    horizontalClass: styles.paginate,
                    bulletClass: styles.bullet,
                    bulletActiveClass: styles.active,
                }}
                modules={[Pagination]}
                className={styles.swiper}
            >
                {
                    data.map(item => (
                        <SwiperSlide key={item.id} className={styles.item}>
                            <Link href={`/products/${item.id}`}>
                                <img
                                    src={item.picture}
                                    alt={item.name}/>
                                <h3>{item.name}</h3>
                                <div className={styles.amount}>
                                    <span>${(item.price / 100).toFixed(2)}</span>
                                    {
                                        item.origin_price &&
                                        <span>${(item.origin_price / 100).toFixed(2)}</span>
                                    }
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}