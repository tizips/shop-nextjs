import {Metadata, ResolvingMetadata} from "next";
import {Col, Row} from "antd";
import {LikeOutlined, ShoppingCartOutlined, TruckOutlined} from "@ant-design/icons";
import {doSetting} from "@/app/actions/setting";
import {doSEO} from "@/app/actions/seo";
import {doPage} from "@/app/actions/page";

import styles from './page.module.scss';

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {

    const p = await parent;

    const seo = await doSEO('category', 'about')

    return {
        title: [seo?.title, p.title?.absolute].filter(item => !!item).join(' - '),
        keywords: seo?.keyword,
        description: seo?.description,
    }
}

export default async function () {

    const setting = await doSetting()

    const page = await doPage('about-us')

    return (
        <div className={styles.main}>

            <div className={styles.head} style={{
                backgroundImage: setting['head_bg'] ? `url(${setting['head_bg']})` : 'none',
            }}>
                <div className={styles.inner}>
                    <h1>{page?.name}</h1>
                    {
                        page?.content &&
                        <div dangerouslySetInnerHTML={{__html: page.content}}
                             className={styles.information}/>
                    }
                </div>
            </div>

            <div className={styles.container}>
                <h2>OUR ADVANTAGES</h2>
                <div className={styles.inner}>
                    <Row gutter={[30, 30]}>
                        <Col span={24} md={8}>
                            <h4><ShoppingCartOutlined className={styles.icon}/></h4>
                            <h3>Large assortment</h3>
                            <p>We offer a wide variety of products for you to choose from.</p>
                        </Col>
                        <Col span={24} md={8}>
                            <h4><LikeOutlined className={styles.icon}/></h4>
                            <h3>Quality requirements</h3>
                            <p>Our passion for the product will help resolve your issue.</p>
                        </Col>
                        <Col span={24} md={8}>
                            <h4><TruckOutlined className={styles.icon}/></h4>
                            <h3>Fast shipment</h3>
                            <p>Orders are shipped on the day of ordering.</p>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}