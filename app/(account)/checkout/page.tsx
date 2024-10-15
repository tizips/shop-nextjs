'use client'

import React, {useEffect, useState} from "react";
import {Alert, Button, Col, ConfigProvider, Form, Input, notification, Row, Select, Space, Table, Tag} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {useRouter} from "nextjs-toploader/app";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './page.module.scss';

export default function () {

    const {data: session, status} = useSession()

    const router = useRouter()

    const [form] = Form.useForm<APICheckout.Form>()

    const [carts, setCarts] = useState<API.Cart[]>([]);
    const [payments, setPayments] = useState<API.PayChannel[]>([]);
    const [shippings, setShippings] = useState<API.Shippings[]>([]);
    const [total, setTotal] = useState<APICheckout.Total>({total: 0, subtotal: 0});
    const [coupon, setCoupon] = useState<APICheckout.Coupon>({money: 0});
    const [shippingFee, setShippingFee] = useState(0)
    const [payment, setPayment] = useState<string>()
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);

    const pay = Form.useWatch('payment', form)
    const shipping = Form.useWatch('shipping', form)

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
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const toShippings = async () => {

        try {

            const response = await fetch('/api/shippings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response) {

                const resp: API.Response<API.Shippings[]> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                setShippings(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        }
    }

    const toPaypal = async (id: string, order: string) => {

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
                    router.push(`/orders/${order}`)
                    return
                }

                setPayment(resp.data.link)

                notification.success({message: 'Payment initiated successfully, waiting for system redirect.'})
            }
        } catch (e: any) {
            notification.error({message: e.message});
        }
    }

    const toOrder = async (body: APICheckout.Submit) => {

        setLoad(true)

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
                body: JSON.stringify(body),
            });

            if (response) {

                const resp: API.Response<API.PlaceOrder> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                notification.success({message: 'Order placed successfully, waiting for the system to initiate payment.'})

                if (resp.data.channel == 'paypal') {
                    await toPaypal(resp.data.pay_id, resp.data.id)
                }
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoad(false)
        }
    }

    const toPayments = async () => {

        try {
            const response = await fetch('/api/payment/channel', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<API.PayChannel[]> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                if (resp.data.length > 0) {
                    form.setFieldValue('payment', resp.data[0].id)
                }

                setPayments(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoad(false)
        }
    }

    const onPayment = (id: number) => {
        form.setFieldValue('payment', id)
    }

    const onSubmit = (values: APICheckout.Form) => {

        let body: APICheckout.Submit = {
            payment: values.payment,
            shipping: values.shipping,
            coupon: values.coupon,
            first_name: values.first_name,
            last_name: values.last_name,
            company: values.company,
            country: values.country,
            prefecture: values.prefecture,
            city: values.city,
            street: values.street,
            detail: values.detail,
            postcode: values.postcode,
            phone: values.phone,
            email: values.email,
            remark: values.remark,
        }

        toOrder(body)
    }

    const onInit = () => {
        form.setFieldsValue({
            shipping: undefined,
            coupon: undefined,
            first_name: undefined,
            last_name: undefined,
            company: undefined,
            country: undefined,
            prefecture: undefined,
            city: undefined,
            street: undefined,
            detail: undefined,
            postcode: undefined,
            phone: undefined,
            email: undefined,
            remark: undefined,
        })
    }

    useEffect(() => {

        if (status == 'authenticated') {
            toPayments()
            onInit()
            toCarts()
            toShippings()
        }
    }, [status]);

    useEffect(() => {

        const tmp: APICheckout.Total = {total: 0, subtotal: 0};

        if (carts) {
            carts.forEach(item => {
                tmp.subtotal += item.price * item.quantity;
                tmp.total += tmp.subtotal;
            })
        }

        setTotal(tmp);

    }, [carts])

    useEffect(() => {

        let fee = 0

        for (const item of shippings) {
            if (item.id == shipping) {
                fee = item.money
                break
            }
        }

        setShippingFee(fee)

    }, [shipping]);

    useEffect(() => {
        if (payment) {
            window.location.href = payment
        }
    }, [payment]);

    return (
        <div className={styles.main}>
            <div className={styles.head}>
                <h1>Checkout</h1>
            </div>
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBorderRadius: 0,
                        }
                    }
                }}
            >
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <div className={styles.container}>
                        <div className={styles.billing}>
                            <h3>Billing details</h3>
                            <Row gutter={30}>
                                <Col span={12}>
                                    <Form.Item label='First name' name='first_name' rules={[{required: true, max: 64}]}>
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Last name' name='last_name' rules={[{required: true, max: 64}]}>
                                        <Input/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label='Company name (optional)' name='company' rules={[{max: 255}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Country' name='country' rules={[{required: true, max: 255}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Prefecture' name='prefecture' rules={[{required: true, max: 255}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Town / City' name='city' rules={[{required: true, max: 255}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Street address' required>
                                <Form.Item label='House number and street name' name='street'
                                           rules={[{required: true, max: 255}]}
                                           labelCol={{span: 0}}>
                                    <Input placeholder='House number and street name'/>
                                </Form.Item>
                                <Form.Item label='Street address' name='detail' labelCol={{span: 0}}
                                           rules={[{max: 255}]}>
                                    <Input placeholder='Apartment, suite, unit etc. (optional)'/>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label='Postcode / ZIP' name='postcode' rules={[{required: true, max: 64}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Phone' name='phone' rules={[{required: true, max: 64}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label='Email address' name='email' rules={[{required: true, max: 120}]}>
                                <Input/>
                            </Form.Item>
                            <h3>Additional information</h3>
                            <Form.Item label='Order notes (optional)' name='remark' rules={[{max: 255}]}>
                                <Input.TextArea
                                    maxLength={255} showCount
                                    placeholder='Notes about your order, e.g. special notes for delivery.'/>
                            </Form.Item>
                        </div>

                        <div className={styles.information}>
                            <h3>Your order</h3>
                            <div className={styles.order}>
                                <Table
                                    rowKey='id'
                                    bordered
                                    dataSource={[
                                        ...carts,
                                        {id: 'subtotal', name: 'Subtotal', total: total.subtotal},
                                        ...(coupon.money ? [{
                                            id: 'coupon',
                                            name: 'Coupon',
                                            total: coupon.money
                                        }] : []),
                                        {id: 'shipping', name: 'Shipping Fee', total: shippingFee},
                                        {
                                            id: 'total',
                                            name: 'Total',
                                            total: total.total + shippingFee + (coupon.money ?? 0)
                                        },
                                    ]}
                                    size='small'
                                    loading={{
                                        size: 'large',
                                        spinning: loading,
                                        indicator: <LoadingOutlined spin/>,
                                    }}
                                    pagination={false}
                                    columns={[
                                        {
                                            align: 'left',
                                            title: 'Product',
                                            render: record => (
                                                <span className={record.quantity && styles.product}>
                                                {record.name}
                                                    {
                                                        record.specifications &&
                                                        <Tag
                                                            style={{marginLeft: '5px'}}>{record.specifications.join('; ')}</Tag>
                                                    }
                                                    {
                                                        record.quantity &&
                                                        <strong> × {record.quantity}</strong>
                                                    }
                                            </span>
                                            )
                                        },
                                        {
                                            align: 'center',
                                            width: 120,
                                            title: 'Total ($)',
                                            render: record => (
                                                record.total ?
                                                    `${(record.total / 100).toFixed(2)}` :
                                                    `${(record.price ? (record.price * record.quantity / 100) : 0).toFixed(2)}`
                                            )
                                        },
                                    ]}
                                />
                            </div>

                            <div>
                                <Form.Item label='Delivery express' name='shipping' rules={[{required: true}]}>
                                    <Select
                                        options={shippings}
                                        fieldNames={{label: 'name', value: 'id'}}
                                    />
                                </Form.Item>
                            </div>

                            <div className={styles.coupon}>
                                <Alert
                                    banner
                                    showIcon={false}
                                    type='info'
                                    description={
                                        <Space align='center'>
                                            <span>Have a coupon?</span>
                                            <Button size='small' type='text'
                                                    onClick={() => setCoupon({open: !coupon.open})}>
                                                Click here to enter your code
                                            </Button>
                                        </Space>
                                    }
                                />
                                {
                                    coupon.open &&
                                    <div className={styles.inner}>
                                        <p>If you have a coupon code, please apply it below.</p>
                                        <Row gutter={30}>
                                            <Col flex="auto">
                                                <Form.Item label='Coupon' name='coupon' labelCol={{span: 0}}>
                                                    <Input placeholder='Coupon Code'/>
                                                </Form.Item>
                                            </Col>
                                            <Col flex="180px">
                                                <Button type='primary' block>Apply Coupon</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                            </div>

                            <div className={styles.payment}>
                                <ul>
                                    {
                                        payments.map(item => (
                                            <li key={item.id} onClick={() => onPayment(item.id)}>
                                                {
                                                    item.channel == 'paypal' ?
                                                        <img src='/static/icon/paypal.png' alt="paypal"/>
                                                        : item.channel
                                                }
                                            </li>
                                        ))
                                    }
                                </ul>
                                <Form.Item label='Payment' name='payment' hidden>
                                    <Input/>
                                </Form.Item>
                            </div>

                            <div className={styles.btn}>
                                <Button type='primary' htmlType='submit' block className={styles.btn} loading={load}>
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </ConfigProvider>
        </div>
    )
}