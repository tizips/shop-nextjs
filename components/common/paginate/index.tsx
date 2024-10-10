import styles from './inex.module.scss'
import Link from "next/link";
import {EllipsisOutlined, LeftOutlined, RightOutlined} from "@ant-design/icons";

export default function ({total, current, size, uri, query}: {
    total: number;
    current: number;
    size: number;
    uri: string;
    query: URLSearchParams;
}) {

    function doEllipsis(arr: number[]) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] !== arr[i - 1] + 1) {
                arr.splice(i, 0, 0); // 插入 0
                i++; // 跳过刚插入的 0
            }
        }
        return arr;
    }

    let items: number[] = []

    // 获取总页数
    const pages = Math.ceil(total / size);

    // 处理第一页的后三个
    for (let i = 1; i < pages && i <= 3; i++) {
        items.push(i)
    }

    if (current - 1 > 0) {
        items.push(current - 1)
    }

    items.push(current)

    if (current + 1 < pages) {
        items.push(current + 1)
    }

    // 处理最后一页的前三个
    for (let i = pages; i > pages - 3 && i > 0; i--) {
        items.push(i)
    }

    items = Array.from(new Set(items))

    items.sort((a, b) => a - b)

    items = doEllipsis(items)

    const toQuery = (query: URLSearchParams, page: number) => {
        query.set('page', `${page}`)
        return query.toString()
    }

    return (
        <div className={styles.main}>
            <ul>
                <li className={current <= 1 ? styles.disabled : undefined}>
                    <Link href={{pathname: uri, query: toQuery(query, 1)}}>
                        <LeftOutlined/>
                    </Link>
                </li>
                {
                    items.map((item, idx) => {
                            return (
                                <li key={idx}
                                    className={`${current == item ? styles.active : undefined} ${item <= 0 ? styles.ellipsis : undefined}`}>
                                    {
                                        item > 0 ?
                                            <Link href={{pathname: uri, query: toQuery(query, item)}}>
                                                {item}
                                            </Link>
                                            : <EllipsisOutlined/>
                                    }
                                </li>
                            )
                        }
                    )
                }
                <li className={current >= pages ? styles.disabled : undefined}>
                    <Link href={{pathname: uri, query: toQuery(query, pages)}}>
                        <RightOutlined/>
                    </Link>
                </li>
            </ul>
        </div>
    )
}