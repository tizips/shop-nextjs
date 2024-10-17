import {Breadcrumb, Tabs} from "antd";
import Link from "next/link";

import styles from './index.module.scss';

import Banner from '@/components/product/banner';
import Shop from '@/components/common/shop';
import Recommend from '@/components/common/recommend';
import {doProductOfInformation, doProductOfRecommended, doProductOfSpecification} from "@/app/actions/product";
import {Metadata, ResolvingMetadata} from "next";
import {doSEO} from "@/app/actions/seo";
import {notFound} from "next/navigation";

export async function generateMetadata(props: {
    params: { id: string }
}, parent: ResolvingMetadata): Promise<Metadata> {

    const p = await parent;

    const seo = await doSEO('product', props.params.id)

    return {
        title: [seo?.title, p.title?.absolute].filter(item => !!item).join(' - '),
        keywords: seo?.keyword,
        description: seo?.description,
    }
}

export default async function (props: { params: { id: string } }) {

    const product = await doProductOfInformation(props.params.id)

    if (!product) {
        notFound()
    }

    let specification: API.Specification | undefined

    if (product.is_multiple) {
        specification = await doProductOfSpecification(props.params.id)
    }

    const recommended = await doProductOfRecommended()

    return (
        <div className={styles.main}>
            <div className={styles.breadcrumb}>
                <Breadcrumb items={[
                    {title: <Link href='/'>Home</Link>},
                    {title: <Link href='/products'>Products</Link>},
                    {title: product.name.length > 32 ? product.name.substring(0, 30) + '...' : product.name},
                ]}/>
            </div>

            <div className={styles.product}>
                <div className={styles.banner}>
                    <Banner pictures={product.pictures}/>
                </div>
                <div className={styles.summary}>
                    <h1>{product.name}</h1>
                    <p className={styles.description}>{product.summary}</p>
                    <Shop id={product.id} price={product.price} origin_price={product.origin_price} sku={product.sku} specification={specification}/>
                    {/*<div className={styles.meta}>*/}
                    {/*    Category: <Link href='/products'>Blouse</Link>*/}
                    {/*</div>*/}
                </div>
            </div>

            <div className={styles.information}>
                <Tabs
                    type='card'
                    defaultActiveKey="1"
                    style={{marginBottom: 32}}
                    items={[
                        {
                            label: 'Description',
                            key: 'description',
                            forceRender: true,
                            children: (
                                <div dangerouslySetInnerHTML={{__html: product.information}}
                                     className={styles.description}/>
                            ),
                        },
                        ...(
                            product.attributes ?
                                [
                                    {
                                        label: 'Attributes',
                                        key: 'attributes',
                                        forceRender: true,
                                        children: (
                                            <table className={styles.attribute}>
                                                <tbody>
                                                {
                                                    product.attributes.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td colSpan={item.value ? 1 : 2}>{item.label}</td>
                                                            {
                                                                item.value &&
                                                                <td>{item.value}</td>
                                                            }
                                                        </tr>
                                                    ))
                                                }
                                                </tbody>
                                            </table>
                                        )
                                    }
                                ] :
                                []
                        )
                    ]}
                />
            </div>
            {
                recommended &&
                <div className={styles.recommend}>
                    <h2>Recommended Products</h2>
                    <div className={styles.inner}>
                        <Recommend data={recommended}/>
                    </div>
                </div>
            }
        </div>
    )
}

export const dynamic = "force-dynamic";