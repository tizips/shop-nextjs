import {Metadata, ResolvingMetadata} from "next";
import {Breadcrumb} from "antd";
import Link from "next/link";
import {notFound} from "next/navigation";
import {doSEO} from "@/app/actions/seo";
import {doPage} from "@/app/actions/pages";

import styles from './page.module.scss';

export async function generateMetadata(props: {
    params: { id: string }
}, parent: ResolvingMetadata): Promise<Metadata> {

    const p = await parent;

    const seo = await doSEO('page', props.params.id)

    return {
        title: [seo?.title, p.title?.absolute].filter(item => !!item).join(' - '),
        keywords: seo?.keyword,
        description: seo?.description,
    }
}

export default async function (props: { params: { id: string } }) {

    const page = await doPage(props.params.id)

    if (!page) {
        notFound()
    }

    return (
        <div className={styles.main}>

            <div className={styles.head}>

                <div className={styles.breadcrumb}>
                    <Breadcrumb items={[
                        {title: <Link href='/'>Home</Link>},
                        {title: page.name},
                    ]}/>
                </div>
            </div>

            <div className={styles.container}>
                <h2 className={styles.title}>{page.name}</h2>
                <div dangerouslySetInnerHTML={{__html: page.content}}
                     className={styles.inner}/>
            </div>
        </div>
    )
}