'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Breadcrumb, Image, notification, Spin, Tag} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";
import {Services} from "@/service/object";

import styles from './page.module.scss';

import Paginate from "@/components/common/paginate";

export default function ({searchParams}: { searchParams: URLSearchParams }) {

    const {data: session, status} = useSession()

    const [load, setLoad] = useState(false)
    const [services, setServices] = useState<API.Paginate<API.Services>>({page: 1, size: 12, total: 0, data: []});

    const toServices = async () => {

        setLoad(true)

        try {

            let search = new URLSearchParams(searchParams);

            let query = search.toString()

            const response = await fetch(`/api/services${query ? '?' + query : ''}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<API.Paginate<API.Services>> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                setServices(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoad(false)
        }
    }

    useEffect(() => {
        if (status == 'authenticated') {
            toServices()
        }
    }, [status, searchParams]);

    return (
        <div className={styles.main}>
            <div className={styles.head}>
                <Breadcrumb items={[
                    {title: <Link href='/'>Home</Link>},
                    {title: 'Services'},
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
                            services.data.map(item => (
                                <React.Fragment key={item.id}>
                                    <tr className={styles.header}>
                                        <td colSpan={2}>
                                            <div className={styles.no}>
                                                <span>No: </span>
                                                <Link href={`/services/${item.id}`}>
                                                    <span>{item.id}</span><EyeOutlined/>
                                                </Link>
                                            </div>
                                        </td>
                                        <td colSpan={2}>
                                            <div className={styles.type}>
                                                {
                                                    Services[item.type] ?
                                                        <Tag
                                                            color={Services[item.type].color}>{Services[item.type].label}</Tag> :
                                                        item.type
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.ext}>
                                                {
                                                    Services[item.status] ?
                                                        <Tag
                                                            color={Services[item.status].color}>{Services[item.status].label}</Tag> :
                                                        item.status
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
                                                    <span>${(value.refund / 100).toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr className={styles.summary}>
                                        <td>Reason:</td>
                                        <td colSpan={4}>
                                            {item.reason}
                                        </td>
                                    </tr>
                                    <tr className={styles.summary}>
                                        <td>Creation Time:</td>
                                        <td colSpan={4}>
                                            {item.created_at}
                                        </td>
                                    </tr>
                                    <tr className={styles.total}>
                                        <td colSpan={5}>
                                            <p>Subtotal: ${(item.subtotal / 100).toFixed(2)}</p>
                                            <p>Shipping Fee: ${(item.shipping / 100).toFixed(2)}</p>
                                            <p>Total: ${(item.refund / 100).toFixed(2)}</p>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                    }
                    </tbody>
                </table>
                <div className={styles.paginate}>
                    <Paginate size={services.size} total={services.total} current={services.page} uri='/services'
                              query={(new URLSearchParams(searchParams))}/>
                </div>
            </div>
        </div>
    )
}