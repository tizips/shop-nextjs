import {Metadata, ResolvingMetadata} from "next";
import {notFound} from "next/navigation";
import {doSEO} from "@/app/actions/seo";
import {doBlog} from "@/app/actions/blog";
import dayjs from "dayjs";

import styles from './page.module.scss';

export async function generateMetadata(props: {
    params: { id: string }
}, parent: ResolvingMetadata): Promise<Metadata> {

    const p = await parent;

    const seo = await doSEO('blog', props.params.id)

    return {
        title: [seo?.title, p.title?.absolute].filter(item => !!item).join(' - '),
        keywords: seo?.keyword,
        description: seo?.description,
    }
}

export default async function (props: { params: { id: string } }) {

    const blog = await doBlog(props.params.id)

    if (!blog) {
        notFound()
    }

    return (
        <div className={styles.main}>
            <div className={styles.head}>
                <h2>{blog.name}</h2>
                <div className={styles.meta}>
                    {
                        blog.posted_at &&
                        <span>{dayjs(blog.posted_at).format('MMMM DD, YYYY')}</span>
                    }
                </div>
            </div>
            <div className={styles.content}>

                {/*<div className={styles.thumb}>*/}
                {/*    <img src={blog.thumb} alt={blog.name}/>*/}
                {/*</div>*/}

                <div dangerouslySetInnerHTML={{__html: blog.content}}
                     className={styles.information} />
            </div>
        </div>
    )
}