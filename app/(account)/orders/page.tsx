'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Breadcrumb, Image, notification, Spin, Tag} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";
import {Orders} from "@/service/object";

import styles from './page.module.scss';

import Paginate from "@/components/common/paginate";

export default function ({searchParams}: { searchParams: URLSearchParams }) {

    const {data: session, status} = useSession()

    const [load, setLoad] = useState(false)
    const [orders, setOrders] = useState<API.Paginate<API.Orders>>({page: 1, size: 12, total: 0, data: []});

    const toOrders = async () => {

        setLoad(true)

        try {

            let search = new URLSearchParams(searchParams);

            let query = search.toString()

            const response = await fetch(`/api/orders${query ? '?' + query : ''}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<API.Paginate<API.Orders>> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }
                console.info(resp.data.page)
                setOrders(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoad(false)
        }
    }

    useEffect(() => {
        if (status == 'authenticated') {
            toOrders()
        }
    }, [status, searchParams]);

    return (
        <div className={styles.main}>
            <div className={styles.head}>
                <Breadcrumb items={[
                    {title: <Link href='/'>Home</Link>},
                    {title: 'Orders'},
                ]}/>
            </div>
            <div className={styles.container}>

                <table>
                    <thead>
                    <tr>
                        <td></td>
                        <td>Product</td>
                        <td width={120}>Price</td>
                        <td>Quantity</td>
                        <td width={120}>Total</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        load ?
                            <tr className={styles.spin}>
                                <td colSpan={5}>
                                    <Spin/>
                                </td>
                            </tr> :
                            orders.data.map(item => (
                                <React.Fragment key={item.id}>
                                    <tr className={styles.header}>
                                        <td colSpan={2}>
                                            <div className={styles.no}>
                                                <span>No: </span>
                                                <Link href={`/orders/${item.id}`}>
                                                    <span>{item.id}</span><EyeOutlined/>
                                                </Link>
                                            </div>
                                        </td>
                                        <td colSpan={3}>
                                            <div className={styles.ext}>
                                                {
                                                    Orders[item.status] &&
                                                    <Tag
                                                        color={Orders[item.status].color}>{Orders[item.status].label}</Tag>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                    {
                                        item.details.map(value => (
                                            <tr className={styles.product} key={value.id}>
                                                <td>
                                                    <Image width={120} src={value.picture} alt={value.name}/>
                                                </td>
                                                <td>
                                                    <h3>{value.name}</h3>
                                                </td>
                                                <td>
                                                    <span>${(value.price / 100).toFixed(2)}</span>
                                                </td>
                                                <td>
                                                    <span>{value.quantity}</span>
                                                </td>
                                                <td>
                                                    <span>${(value.price * value.quantity / 100).toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr className={styles.total}>
                                        <td colSpan={5}>
                                            {/*<p>Subtotal: $12.00</p>*/}
                                            {/*<p>Coupon: -$12.00</p>*/}
                                            <p>Total: ${(item.prices / 100).toFixed(2)}</p>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                    }
                    </tbody>
                </table>
                <div className={styles.paginate}>
                    <Paginate size={orders.size} total={orders.total} current={orders.page} uri='/orders'
                              query={(new URLSearchParams(searchParams))}/>
                </div>
            </div>
        </div>
    )
}