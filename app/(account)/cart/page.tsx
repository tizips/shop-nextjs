'use client'

import {useEffect, useState} from "react";
import Link from "next/link";
import {Button, ConfigProvider, Image, InputNumber, notification, Popconfirm, Table, Tag} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './page.module.scss';

export default function () {

    const {data: session, status} = useSession()

    const [collapsed, setCollapsed] = useState(false);
    const [carts, setCarts] = useState<API.Cart[]>([]);
    const [total, setTotal] = useState<APICart.Total>({total: 0, subtotal: 0});
    const [loading, setLoading] = useState(false);

    const onResize = () => {
        if (window.document.documentElement.clientWidth <= 768) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }

    const toCarts = async () => {

        setLoading(true)

        try {

            const response = await fetch('/api/carts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<API.Cart[]> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                setCarts(resp.data)
            }
        } catch (e) {
            // @ts-ignore
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const toQuantity = async (id: number, quantity: number) => {

        setLoading(true)

        try {

            const response = await fetch(`/api/carts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
                body: JSON.stringify({id, quantity}),
            });

            if (response) {

                const resp: API.Response<any> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                await toCarts()
            }
        } catch (e) {
            // @ts-ignore
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const toDelete = async (id: number) => {

        setLoading(true)

        try {

            const response = await fetch(`/api/carts/${id}`, {
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

                await toCarts()
            }
        } catch (e) {
            // @ts-ignore
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const onQuantity = (id: number, val?: number) => {

        toQuantity(id, val ?? 1)
    }

    const onDelete = (id: number) => {

        toDelete(id)
    }

    useEffect(() => {

        if (status == 'authenticated') {
            toCarts()
        }
    }, [session, status]);

    useEffect(() => {

        onResize()

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }

    }, [])

    useEffect(() => {

        const tmp: APICart.Total = {total: 0, subtotal: 0};

        if (carts) {
            carts.forEach(item => {
                tmp.subtotal += item.price * item.quantity;
                tmp.total += tmp.subtotal;
            })
        }

        setTotal(tmp);

    }, [carts])

    return (
        <div className={styles.main}>
            <div className={styles.head}>
                <h1>Cart</h1>
            </div>
            <div className={styles.table}>
                <Table
                    rowKey='id'
                    bordered
                    dataSource={carts}
                    size={collapsed ? 'small' : 'large'}
                    loading={loading}
                    pagination={false}
                    columns={[
                        {
                            align: 'center',
                            width: 160,
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
                                <>
                                    <Link href={`/products/${record.product}`}>{record.name}</Link>
                                    {
                                        record.specifications &&
                                        <>
                                            <br/><br/>
                                            <Tag color='var(--color)'>{record.specifications.join('; ')}</Tag>
                                        </>
                                    }
                                </>
                            )
                        },
                        {
                            width: 80,
                            align: 'center',
                            title: 'Price',
                            render: record => `$${(record.price / 100).toFixed(2)}`
                        },
                        {
                            align: 'center',
                            title: 'Quantity',
                            render: record => (
                                <InputNumber value={record.quantity}
                                             min={1} max={99}
                                             onChange={v => onQuantity(record.id, v)}
                                             className={collapsed ? styles.quantity : ''}/>
                            )
                        },
                        {
                            align: 'center',
                            width: 80,
                            title: 'Total',
                            render: record => `$${(record.price * record.quantity / 100).toFixed(2)}`
                        },
                        {
                            align: 'center',
                            width: 60,
                            title: '',
                            render: record => (
                                <Popconfirm
                                    title="Remove product."
                                    description='Are you sure you want to remove this product from the cart?'
                                    placement='topRight'
                                    onConfirm={() => onDelete(record.id)}
                                >
                                    <Button type='text' danger icon={<DeleteOutlined/>}/>
                                </Popconfirm>
                            )
                        }
                    ]}

                />
            </div>
            <div className={styles.information}>

                <div className={styles.inner}>
                    <h2>Cart Totals</h2>
                    <ConfigProvider
                        theme={{
                            components: {
                                Table: {
                                    headerBorderRadius: 0,
                                }
                            }
                        }}
                    >
                        <Table
                            bordered
                            rowKey='id'
                            pagination={false}
                            showHeader={false}
                            size='small'
                            dataSource={[
                                {
                                    id: 'subtotal',
                                    label: 'Subtotal',
                                    price: total.subtotal,
                                },
                                {
                                    id: 'total',
                                    label: 'Total',
                                    price: total.total,
                                }
                            ]}
                            columns={[
                                {
                                    align: 'center',
                                    title: 'label',
                                    dataIndex: 'label',
                                },
                                {
                                    align: 'center',
                                    title: 'price',
                                    render: record => `$${(record.price ? record.price / 100 : 0).toFixed(2)}`
                                }
                            ]}
                        />
                    </ConfigProvider>
                    <Link href='/checkout'>
                        <Button type='primary' block className={styles.btn}>Proceed To Checkout</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}