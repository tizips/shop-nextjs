import {Metadata, ResolvingMetadata} from "next";
import Link from "next/link";
import {Col, Row} from "antd";
import {doBanners} from "@/app/actions/banner";
import {doProductOfHot, doProductOfRecommended} from "@/app/actions/product";
import {doAdvertise} from "@/app/actions/advertise";
import {doSEO} from "@/app/actions/seo";

import styles from "./page.module.scss";

import Banner from '@/components/home/banner';
import Recommend from '@/components/common/recommend';

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {

    const p = await parent;

    const seo = await doSEO('category', 'home')

    return {
        title: [seo?.title, p.title?.absolute].filter(item => !!item).join(' - '),
        keywords: seo?.keyword,
        description: seo?.description,
    }
}

export default async function Home({searchParams}: { searchParams: any }) {

    const banners = await doBanners()

    const advertises = await doAdvertise('home', 'new_product')

    const hots = await doProductOfHot()

    const recommended = await doProductOfRecommended()

    return (
        <main className={styles.main}>
            {
                banners && banners.length > 0 &&
                <Banner data={banners}/>
            }

            <div className={styles.container}>

                {
                    advertises && advertises.length > 0 &&
                    <div className={styles.new}>
                        <h2>New Product</h2>
                        <div className={styles.inner}>
                            {
                                advertises.length > 0 &&
                                <div className={`${styles.item} ${styles.first}`}>
                                    <Link target={advertises[0].target} href={advertises[0].url}>
                                        <div className={styles.image}>
                                            <img src={advertises[0].thumb} alt={advertises[0].title}/>
                                        </div>
                                        <div className={styles.title}>
                                            <h3>{advertises[0].title}</h3>
                                        </div>
                                    </Link>
                                </div>
                            }
                            {
                                advertises.length > 1 &&
                                <div className={`${styles.item} ${styles.second}`}>
                                    <Link target={advertises[1].target} href={advertises[1].url}>
                                        <div className={styles.image}>
                                            <img src={advertises[1].thumb} alt={advertises[1].title}/>
                                        </div>
                                        <div className={styles.title}>
                                            <h3>{advertises[1].title}</h3>
                                        </div>
                                    </Link>
                                </div>
                            }
                            {
                                advertises.length > 2 &&
                                <div className={`${styles.item} ${styles.third}`}>
                                    <Link target={advertises[2].target} href={advertises[2].url}>
                                        <div className={styles.image}>
                                            <img src={advertises[2].thumb} alt={advertises[2].title}/>
                                        </div>
                                        <div className={styles.title}>
                                            <h3>{advertises[2].title}</h3>
                                        </div>
                                    </Link>
                                </div>
                            }
                            {
                                advertises.length > 3 &&
                                <div className={`${styles.item} ${styles.fourth}`}>
                                    <Link target={advertises[3].target} href={advertises[3].url}>
                                        <div className={styles.image}>
                                            <img src={advertises[3].thumb} alt={advertises[3].title}/>
                                        </div>
                                        <div className={styles.title}>
                                            <h3>{advertises[3].title}</h3>
                                        </div>
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                }

                {
                    hots && hots.length > 0 &&
                    <div className={styles.hot}>
                        <h2>Hot Product</h2>
                        <div className={styles.inner}>
                            <Row gutter={[30, 30]}>
                                {
                                    hots.map(item => (
                                        <Col span={12} md={6} key={item.id}>
                                            <Link href={`/products/${item.id}`}>
                                                <img src={item.picture} alt={item.name}/>
                                                <h3>{item.name}</h3>
                                                <div className={styles.amount}>
                                                    <span>${(item.price / 100).toFixed(2)}</span>
                                                    {
                                                        item.origin_price &&
                                                        <span>${(item.origin_price / 100).toFixed(2)}</span>
                                                    }
                                                </div>
                                            </Link>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </div>
                    </div>
                }

                {
                    recommended && recommended.length > 0 &&
                    <div className={styles.recommend}>
                        <h2>Recommended Products</h2>
                        <div className={styles.inner}>
                            <Recommend data={recommended}/>
                        </div>
                    </div>
                }
            </div>
        </main>
    );
}

export const dynamic = "force-dynamic";