'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {
    Badge,
    Breadcrumb,
    Button,
    Card,
    Col,
    ConfigProvider,
    Image, Modal,
    notification,
    Row,
    Spin,
    Steps,
    Table, Tag,
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
import {useRouter} from "nextjs-toploader/app";
import Constants from "@/util/Constants";
import {Orders} from "@/service/object";

import styles from './page.module.scss';

import Service from '@/components/order/service'
import Feedback from '@/components/order/feedback'

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

    const [modal, contextHolder] = Modal.useModal();

    const router = useRouter()

    const [statuses, setStatuses] = useState<APIOrder.Status[]>(Status);
    const [order, setOrder] = useState<API.Order>()
    const [loading, setLoading] = useState<APIOrder.Loading>({})
    const [payment, setPayment] = useState<string>()
    const [load, setLoad] = useState(true);
    const [service, setService] = useState(false)
    const [services, setServices] = useState(false)
    const [feedback, setFeedback] = useState(false)

    const toPaypal = async (id: string) => {

        setLoading({...loading, payment: true})

        try {
            const response = await fetch('/api/payment/paypal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
                body: JSON.stringify({id}),
            });

            if (response) {

                const resp: API.Response<API.Paypal> = await response.json();

                if (resp.code != Constants.Success) {
                    notification.error({message: resp.message});
                    return
                }

                setPayment(resp.data.link)

                notification.success({message: 'Payment initiated successfully, waiting for system redirect.'})
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading({...loading, payment: false})
        }
    }

    const toOrder = async () => {

        setLoad(true)

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
                    router.push('/404')
                    return
                }

                for (const item of resp.data.details) {
                    if (item.quantity > (item.returned + item.services)) {
                        setServices(true)
                        break
                    }
                }

                setOrder(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoad(false)
        }
    }

    const toReceived = async () => {

        setLoading({...loading, received: true})

        try {
            const response = await fetch('/api/order/received', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
                body: JSON.stringify({id: params.no}),
            });

            if (response) {

                const resp: API.Response<any> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                notification.success({message: 'The order has been completed.'})

                toOrder()
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading({...loading, received: false})
        }
    }

    const onReceived = () => {
        modal.confirm({
            centered: true,
            icon: <FileDoneOutlined/>,
            title: 'Confirm Receipt',
            content: 'Are you sure you have received the product? ',
            onOk: toReceived,
        })
    }

    const onPayment = () => {

        if (order?.payment && !order.payment.no) {

            if (order.payment.channel == 'paypal') {
                toPaypal(order.payment.id)
            }
        }
    }

    const onService = () => {
        setService(true)
    }

    const onFeedback = () => {
        setFeedback(true)
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
                } else if (item.action == 'received') {
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

    useEffect(() => {
        if (payment) {
            window.location.href = payment
        }
    }, [payment]);

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
            {contextHolder}
            <div className={styles.main}>
                <div className={styles.head}>
                    <Breadcrumb items={[
                        {title: <Link href='/'>Home</Link>},
                        {title: <Link href='/orders'>Orders</Link>},
                        {title: params.no},
                    ]}/>
                </div>
                <Spin spinning={load}>
                    <div className={styles.container}>

                        <Card className={styles.information}>
                            <Row>
                                <Col span={24} md={8} className={styles.left}>
                                    <ul>
                                        <li>
                                            <p className={styles.label}>No:</p>
                                            <p className={styles.value}>{order?.id}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Order Time:</p>
                                            <p className={styles.value}>{order?.create_at}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Status:</p>
                                            <p className={styles.value}>
                                                {
                                                    order?.status && Orders[order.status] ?
                                                        <Tag
                                                            color={Orders[order.status].color}>{Orders[order.status].label}</Tag> :
                                                        order?.status
                                                }
                                            </p>
                                        </li>
                                    </ul>
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
                                                    services && (order?.status == 'shipment' || order?.status == 'receipt' || order?.status == 'received') &&
                                                    <li>
                                                        <Button type='primary' danger onClick={onService}
                                                                loading={loading.service}>After-Sales</Button>
                                                    </li>
                                                }
                                                {
                                                    order?.status == 'receipt' &&
                                                    <li>
                                                        <Button type='primary' onClick={onReceived}
                                                                loading={loading.received}>Received</Button>
                                                    </li>
                                                }
                                                {
                                                    order?.status == 'pay' &&
                                                    <li>
                                                        <Button type='primary' onClick={onPayment}
                                                                loading={loading.payment}>Payment</Button>
                                                    </li>
                                                }
                                                {
                                                    order?.is_appraisal == 2 &&
                                                    <li>
                                                        <Button type='primary' onClick={onFeedback}>Feedback</Button>
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
                                   bordered={false} loading={load} scroll={{x: 'max-content'}}>
                                <Table.Column title='' width={140} render={record => (
                                    <Image width={120} src={record.picture} alt={record.name}/>
                                )}/>
                                <Table.Column width={360} title='Product' align='center' render={record => (
                                    record.service ?
                                        <Badge.Ribbon text="After-Sales" color="red">
                                            <h3 className={styles.service}>{record.name}</h3>
                                        </Badge.Ribbon> :
                                        <h3>{record.name}</h3>
                                )}/>
                                <Table.Column width={120} title='Attributes' align='center' render={record => (
                                    record.specifications?.join('; ')
                                )}/>
                                <Table.Column width={120} title='Price' align='center' render={record =>
                                    <div>
                                        <p>${(record.price / 100).toFixed(2)}</p>
                                        {
                                            record.refund && record.refund > 0 ?
                                                <p className={styles.refunded}>
                                                    Refunded:&nbsp;
                                                    <span>${(record.refund / 100).toFixed(2)}</span></p> : <></>
                                        }
                                    </div>
                                }/>
                                <Table.Column width={80} title='Quantity' align='center' render={record => (
                                    <div>
                                        <p>{record.quantity}</p>
                                        {
                                            record.returned && record.returned > 0 ?
                                                <p className={styles.returned}>
                                                    Returned:&nbsp;
                                                    <span>{record.returned}</span>
                                                </p>
                                                : <></>
                                        }
                                    </div>
                                )}/>
                            </Table>
                        </Card>
                    </div>
                </Spin>
            </div>
            {
                order &&
                <Service
                    open={service}
                    id={order.id}
                    status={order.status}
                    details={order.details}
                    onSuccess={() => {
                        toOrder()
                        setService(false)
                    }}
                    onCancel={() => setService(false)}
                />
            }
            {
                order &&
                <Feedback
                    open={feedback}
                    id={order.id}
                    onSuccess={() => {
                        toOrder()
                        setFeedback(false)
                    }}
                    onCancel={() => setFeedback(false)}
                />
            }
        </ConfigProvider>
    )
}