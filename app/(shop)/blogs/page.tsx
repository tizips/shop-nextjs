import {Metadata, ResolvingMetadata} from "next";
import Link from "next/link";
import {Empty} from "antd";
import {doSEO} from "@/app/actions/seo";
import {doBlogs} from "@/app/actions/blog";
import dayjs from "dayjs";

import styles from './page.module.scss';

import Paginate from "@/components/common/paginate";
import {doPage} from "@/app/actions/pages";
import {doSetting} from "@/app/actions/setting";

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {

    const p = await parent;

    const seo = await doSEO('category', 'blog')

    return {
        title: [seo?.title, p.title?.absolute].filter(item => !!item).join(' - '),
        keywords: seo?.keyword,
        description: seo?.description,
    }
}

export default async function ({searchParams}: { searchParams: any }) {

    const setting = await doSetting()

    const page = await doPage('blog')

    const search = new URLSearchParams(searchParams)

    const blogs = await doBlogs(search)

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
                {
                    blogs.data && blogs.data.length > 0 ?
                        <>
                            {
                                blogs.data.map(item => (
                                    <div key={item.id} className={styles.item}>

                                        <div className={styles.thumb}>
                                            <img src={item.thumb} alt={item.name}/>
                                        </div>

                                        <div className={styles.information}>
                                            <div className={styles.inner}>
                                                <h2>
                                                    <Link href={`/blogs/${item.id}`}>{item.name}</Link>
                                                </h2>
                                                <div className={styles.meta}>
                                                    {
                                                        item.posted_at &&
                                                        <span>{dayjs(item.posted_at).format('MMMM DD, YYYY')}</span>
                                                    }
                                                </div>
                                                <p>{item.summary}</p>
                                                <div className={styles.more}>
                                                    <Link href={`/blogs/${item.id}`}>Read More</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <Paginate size={blogs.size} total={blogs.total} current={blogs.page} uri='/blogs'
                                      query={search}/>
                        </> :
                        <div>
                            <Empty/>
                        </div>
                }

            </div>
        </div>
    )
}