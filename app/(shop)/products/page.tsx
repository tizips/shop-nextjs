import {Metadata, ResolvingMetadata} from "next";
import Link from "next/link";
import {Breadcrumb, Col, Row, Select, Empty} from "antd";
import {doProducts} from "@/app/actions/product";
import {doCategories} from "@/app/actions/category";
import {doSEO} from "@/app/actions/seo";

import styles from './page.module.scss';

import Filter from '@/components/product/filter';
import Search from '@/components/product/search';
import Paginate from '@/components/common/paginate';

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {

    const p = await parent;

    const seo = await doSEO('category', 'products')

    return {
        title: [seo?.title, p.title?.absolute].filter(item => !!item).join(' - '),
        keywords: seo?.keyword,
        description: seo?.description,
    }
}

export default async function ({searchParams}: { searchParams: URLSearchParams }) {

    const categories = await doCategories()

    const query = new URLSearchParams(searchParams)

    query.set('size', '12')

    const products = await doProducts(query)

    return (
        <div className={styles.main}>
            <div className={styles.head}>

                <div className={styles.breadcrumb}>
                    <Breadcrumb items={[
                        {title: <Link href='/'>Home</Link>},
                        {title: <Link href='/products'>Products</Link>},
                        // {title: 'Tool'},
                    ]}/>
                </div>

                <div className={styles.inner}>

                    <div className={styles.filter}>
                        <Filter categories={categories}/>
                    </div>

                    <div className={styles.sort}>
                        {/*<Select*/}
                        {/*    defaultValue='default'*/}
                        {/*    className={styles.select}*/}
                        {/*    options={[*/}
                        {/*        {label: 'Default sorting', value: 'default'},*/}
                        {/*        {label: 'Sort by popularity', value: 'popularity'},*/}
                        {/*        {label: 'Sort by average rating', value: 'rating'},*/}
                        {/*        {label: 'Sort by latest', value: 'latest'},*/}
                        {/*        {label: 'Sort by price: low to high', value: 'low'},*/}
                        {/*        {label: 'Sort by price: high to low', value: 'high'},*/}
                        {/*    ]}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>

            <div className={styles.container}>

                <div className={styles.search}>
                    <Search categories={categories}/>
                </div>

                <div className={styles.product}>
                    <div className={styles.inner}>
                        {
                            products.data ?
                                <Row gutter={[30, 30]}>
                                    {
                                        products.data?.map(item => (
                                            <Col key={item.id} span={12} md={8}>
                                                <Link href={`/products/${item.id}`}>
                                                    <img src={item.picture} alt={item.name}/>
                                                    <h3>{item.name}</h3>
                                                    <div className={styles.amount}>
                                                        <span>${(item.price / 100).toFixed(2)}</span>
                                                        {
                                                            item.origin_price &&
                                                            <span
                                                                className={styles.del}>${(item.origin_price / 100).toFixed(2)}</span>
                                                        }
                                                    </div>
                                                </Link>
                                            </Col>
                                        ))
                                    }
                                </Row> :
                                <Empty/>
                        }
                    </div>
                    {
                        products.data &&
                        <Paginate size={products.size} current={products.page} total={products.total} uri='/products'
                                  query={query}/>
                    }
                </div>
            </div>
        </div>
    )
}