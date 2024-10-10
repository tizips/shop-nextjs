'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    ConfigProvider,
    Image,
    notification,
    Row,
    Spin,
    Steps,
    Table,
    Timeline
} from "antd";
import {
    FileDoneOutlined,
    GiftOutlined,
    ShoppingCartOutlined,
    TransactionOutlined,
    TruckOutlined
} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './page.module.scss';

const Status: APIOrder.Status[] = [
    {
        icon: <ShoppingCartOutlined/>,
        title: 'Place Order',
    },
    {
        icon: <TransactionOutlined/>,
        title: 'Payment Successful',
    },
    {
        icon: <GiftOutlined/>,
        title: 'Shipment Dispatched',
    },
    {
        icon: <TruckOutlined/>,
        title: 'Delivered',
    },
    {
        icon: <FileDoneOutlined/>,
        title: 'Completed',
    },
]

export default function ({params}: { params: { no: string } }) {

    const {data: session, status} = useSession()

    const [statuses, setStatuses] = React.useState<APIOrder.Status[]>(Status);
    const [order, setOrder] = useState<API.Order>()
    const [loading, setLoading] = React.useState(true);

    const toOrder = async () => {

        setLoading(true)

        try {

            const response = await fetch(`/api/orders/${params.no}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<API.Order> = await response.json();

                if (resp.code != Constants.Success) {
                    // redirect(403, '/404')
                }

                setOrder(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (order) {

            const data = [...statuses]

            for (const item of order.logs) {
                if (item.action == 'order') {
                    data[0].description = item.created_at
                    data[0].status = 'finish'

                    data[1].status = 'process'
                } else if (item.action == 'payment') {
                    data[1].description = item.created_at
                    data[1].status = 'finish'

                    data[2].status = 'process'
                } else if (item.action == 'shipment') {
                    data[2].description = item.created_at
                    data[2].status = 'finish'

                    data[3].status = 'process'
                } else if (item.action == 'receipt') {
                    data[3].description = item.created_at
                    data[3].status = 'finish'

                    data[4].status = 'process'
                } else if (item.action == 'completed') {
                    data[4].description = item.created_at
                    data[4].status = 'finish'
                }
            }

            setStatuses(data)
        }
    }, [order]);

    useEffect(() => {
        if (status == "authenticated") {
            toOrder()
        }
    }, [status]);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Card: {
                        paddingLG: 0,
                    },
                    Steps: {
                        customIconFontSize: 32,
                        fontSizeLG: 13,
                        titleLineHeight: 14,
                        fontSize: 12,
                        lineHeight: 1.1,
                        lineWidth: 3,
                    }
                }
            }}
        >
            <div className={styles.main}>
                <div className={styles.head}>
                    <Breadcrumb items={[
                        {title: <Link href='/'>Home</Link>},
                        {title: <Link href='/orders'>Orders</Link>},
                        {title: params.no},
                    ]}/>
                </div>
                <Spin spinning={loading}>
                    <div className={styles.container}>

                        <Card className={styles.information}>
                            <Row>
                                <Col span={24} md={8} className={styles.left}>
                                    <ul>
                                        <li>
                                            <p className={styles.label}>Subtotal:</p>
                                            <p className={styles.value}>${((order?.total_price ?? 0) / 100).toFixed(2)}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Coupon:</p>
                                            <p className={styles.value}>-${((order?.coupon_price ?? 0) / 100).toFixed(2)}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Total:</p>
                                            <p className={styles.value}>${((order?.prices ?? 0) / 100).toFixed(2)}</p>
                                        </li>
                                    </ul>

                                    {
                                        order?.payment &&
                                        <ul>
                                            <li>
                                                <p className={styles.label}>Payment ID:</p>
                                                <p className={styles.value}>{order.payment.id}</p>
                                            </li>
                                            {
                                                order.payment.paid_at &&
                                                <li>
                                                    <p className={styles.label}>Payment Time:</p>
                                                    <p className={styles.value}>{order.payment.paid_at}</p>
                                                </li>
                                            }
                                            <li>
                                                <p className={styles.label}>Payment Method:</p>
                                                <p className={styles.value}>
                                                    {
                                                        order.payment.channel == 'paypal' ?
                                                            <img src="/static/icon/paypal.png" alt="paypal"/>
                                                            : <></>
                                                    }
                                                </p>
                                            </li>
                                            {
                                                order.payment.no &&
                                                <li>
                                                    <p className={styles.label}>Other No:</p>
                                                    <p className={styles.value}>{order.payment.no}</p>
                                                </li>
                                            }
                                        </ul>
                                    }

                                    <ul>
                                        <li>
                                            <p className={styles.label}>Full Name:</p>
                                            <p className={styles.value}>{order?.address.first_name} {order?.address.last_name}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Company:</p>
                                            <p className={styles.value}>{order?.address.company}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Country:</p>
                                            <p className={styles.value}>{order?.address.country}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Prefecture:</p>
                                            <p className={styles.value}>{order?.address.prefecture}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Town / City:</p>
                                            <p className={styles.value}>{order?.address.city}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Street address:</p>
                                            <p className={styles.value}>{order?.address.street}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Postcode / ZIP:</p>
                                            <p className={styles.value}>{order?.address.postcode}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Phone:</p>
                                            <p className={styles.value}>{order?.address.phone}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Email address:</p>
                                            <p className={styles.value}>{order?.address.email}</p>
                                        </li>
                                    </ul>
                                </Col>
                                <Col span={24} md={16} className={styles.right}>

                                    <div className={styles.status}>

                                        <div className={styles.inner}>
                                            <Steps items={statuses} labelPlacement='vertical'/>
                                        </div>

                                        <div className={styles.operate}>
                                            <ul>
                                                {
                                                    order?.status == 'shipment' &&
                                                    <li>
                                                        <Button type='primary' danger>Cancel</Button>
                                                    </li>
                                                }
                                                {
                                                    order?.status == 'receipt' &&
                                                    <li>
                                                        <Button type='primary'>Completed</Button>
                                                    </li>
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={styles.tracking}>
                                        <Timeline
                                            mode='left'
                                            items={order?.logs.map(item => ({
                                                label: item.created_at,
                                                children: item.content,
                                            }))}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        <Card className={styles.products}>
                            <Table dataSource={order?.details} rowKey='id' size='small' pagination={false}
                                   bordered={false} scroll={{ x: 'max-content' }}>
                                <Table.Column title='' width={140} render={record => (
                                    <Image width={120} src={record.picture} alt={record.name}/>
                                )}/>
                                <Table.Column width={360} title='Product' align='center' dataIndex='name'/>
                                <Table.Column width={120} title='Attributes' align='center' render={record => (
                                    record.specifications?.join('; ')
                                )}/>
                                <Table.Column width={120} title='Price' align='center' render={record =>
                                    `$${(record.price / 100).toFixed(2)}`
                                }/>
                                <Table.Column width={80} title='Quantity' align='center' dataIndex='quantity'/>
                            </Table>
                        </Card>
                    </div>
                </Spin>
            </div>
        </ConfigProvider>
    )
}