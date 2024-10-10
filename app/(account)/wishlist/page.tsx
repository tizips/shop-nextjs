'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Button, Image, notification, Popconfirm, Space, Table, Tooltip} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './page.module.scss';

import Paginate from "@/components/common/paginate";

export default function ({searchParams}: { searchParams: URLSearchParams }) {

    const {data: session, status} = useSession()

    const [collapsed, setCollapsed] = useState(false);
    const [wishlist, setWishlist] = useState<API.Paginate<API.Wishlists>>({page: 1, total: 0, size: 12, data: []});
    const [loading, setLoading] = useState(false);

    const toWishlists = async () => {

        setLoading(true)

        try {

            let search = new URLSearchParams(searchParams);

            let query = search.toString()

            const response = await fetch(`/api/wishlists${query ? '?' + query : ''}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<API.Paginate<API.Wishlists>> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                setWishlist(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async (id: string) => {

        setLoading(true)

        try {

            const response = await fetch(`/api/wishlists/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<any> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                await toWishlists()
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const onResize = () => {
        if (window.document.documentElement.clientWidth <= 768) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }

    useEffect(() => {

        onResize()

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }

    }, [])

    useEffect(() => {
        if (status == 'authenticated') {
            toWishlists()
        }
    }, [status]);

    return (
        <div className={styles.main}>
            <div className={styles.head}>
                <h1>WISHLIST</h1>
            </div>
            <div className={styles.table}>
                <Table
                    rowKey='id'
                    bordered
                    dataSource={wishlist.data}
                    size={collapsed ? 'small' : 'large'}
                    loading={loading}
                    pagination={false}
                    columns={[
                        {
                            align: 'center',
                            title: '',
                            hidden: collapsed,
                            render: record => (
                                <Image width={120} src={record.picture} alt={record.name}/>
                            )
                        },
                        {
                            align: collapsed ? 'left' : 'center',
                            title: 'Product',
                            render: record => (
                                <Link href={`/products/${record.id}`}>{record.name}</Link>
                            )
                        },
                        {
                            align: 'center',
                            width: 100,
                            title: 'Price',
                            render: record => `$${(record.price / 100).toFixed(2)}`
                        },
                        // {
                        //     align: 'center',
                        //     title: 'Stock Status',
                        //     render: record => (
                        //         'IN STOCK / OUT STOCK'
                        //     )
                        // },
                        {
                            align: 'center',
                            width: 140,
                            title: 'Added Time',
                            render: record => record.created_at
                        },
                        {
                            align: 'center',
                            title: '',
                            render: record => (
                                <Space>
                                    <Tooltip title='Remove'>
                                        <Popconfirm
                                            placement='topRight'
                                            title='Are you sure you want to remove this from your wishlist?'
                                            onConfirm={() => onDelete(record.id)}
                                        >
                                            <Button type='text' danger icon={<DeleteOutlined/>}/>
                                        </Popconfirm>
                                    </Tooltip>
                                </Space>
                            )
                        }
                    ]}

                />
                <div className={styles.paginate}>
                    <Paginate size={wishlist.size} total={wishlist.total} current={wishlist.page} uri='/wishlist'
                              query={(new URLSearchParams(searchParams))}/>
                </div>
            </div>
        </div>
    )
}