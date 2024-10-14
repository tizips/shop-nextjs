'use client'

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    ConfigProvider,
    Image, Modal,
    notification,
    Row,
    Spin,
    Table, Tag,
    Timeline
} from "antd";
import {FileDoneOutlined, TruckOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import {useRouter} from "nextjs-toploader/app";
import {Services} from "@/service/object";
import Constants from "@/util/Constants";

import styles from './page.module.scss';

import Dispatch from '@/components/service/dispatch'

export default function ({params}: { params: { no: string } }) {

    const {data: session, status} = useSession()

    const [modal, contextHolder] = Modal.useModal();

    const router = useRouter()

    const [service, setService] = useState<API.Service>()
    const [loading, setLoading] = useState<APIService.Loading>({})
    const [load, setLoad] = useState(true);
    const [dispatch, setDispatch] = useState(false)

    const toService = async () => {

        setLoad(true)

        try {

            const response = await fetch(`/api/services/${params.no}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
            });

            if (response) {

                const resp: API.Response<API.Service> = await response.json();

                if (resp.code != Constants.Success) {
                    router.push('/404')
                    return
                }

                setService(resp.data)
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoad(false)
        }
    }

    const toCancel = async () => {

        setLoading({...loading, cancel: true})

        try {
            const response = await fetch(`/api/services/${params.no}`, {
                method: 'DELETE',
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

                notification.success({message: 'The after-sales service has been canceled.'})

                router.push('/services')
                // toService()
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading({...loading, cancel: false})
        }
    }

    const toReceipt = async () => {

        setLoading({...loading, receipt: true})

        try {
            const response = await fetch('/api/service/finish', {
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

                notification.success({message: 'You have confirmed receipt, and the after-sales order will be completed.'})

                toService()
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading({...loading, receipt: false})
        }
    }

    const onCancel = () => {
        modal.confirm({
            centered: true,
            icon: <FileDoneOutlined/>,
            title: 'Cancel After-Sales Service',
            content: 'Are you sure you want to cancel the after-sales service?',
            onOk: toCancel,
        })
    }

    const onReceipt = () => {
        modal.confirm({
            centered: true,
            icon: <TruckOutlined/>,
            title: 'Confirm Receipt',
            content: 'Are you sure you have received the replacement item from the seller?',
            onOk: toReceipt,
        })
    }

    const onDispatch = () => {
        setDispatch(true)
    }

    useEffect(() => {
        if (status == "authenticated") {
            toService()
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
            {contextHolder}
            <div className={styles.main}>
                <div className={styles.head}>
                    <Breadcrumb items={[
                        {title: <Link href='/'>Home</Link>},
                        {title: <Link href='/services'>Services</Link>},
                        {title: params.no},
                    ]}/>
                </div>
                <Spin spinning={load}>
                    <div className={styles.container}>

                        <Card className={styles.products}>
                            <Table dataSource={service?.details} rowKey='id' size='small' pagination={false}
                                   bordered={false} loading={load} scroll={{x: 'max-content'}}>
                                <Table.Column title='' width={140} render={record => (
                                    <Image width={120} src={record.picture} alt={record.name}/>
                                )}/>
                                <Table.Column width={360} title='Product' align='center' render={record => (
                                    <h3 className={styles.service}>{record.name}</h3>
                                )}/>
                                <Table.Column width={120} title='Attributes' align='center' render={record => (
                                    record.specifications?.join('; ')
                                )}/>
                                <Table.Column width={120} title='Price' align='center' render={record =>
                                    `$${(record.price / 100).toFixed(2)}`
                                }/>
                                <Table.Column width={80} title='Quantity' align='center' dataIndex='quantity'/>
                            </Table>
                        </Card>

                        <Card className={styles.information}>
                            <Row>
                                <Col span={24} md={8} className={styles.left}>
                                    <ul>
                                        <li>
                                            <p className={styles.label}>Subtotal:</p>
                                            <p className={styles.value}>${((service?.subtotal ?? 0) / 100).toFixed(2)}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Shipping Fee:</p>
                                            <p className={styles.value}>${((service?.shipping ?? 0) / 100).toFixed(2)}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Total:</p>
                                            <p className={styles.value}>${((service?.refund ?? 0) / 100).toFixed(2)}</p>
                                        </li>
                                    </ul>

                                    {/*{*/}
                                    {/*    service?.payment &&*/}
                                    {/*    <ul>*/}
                                    {/*        <li>*/}
                                    {/*            <p className={styles.label}>Payment ID:</p>*/}
                                    {/*            <p className={styles.value}>{service.payment.id}</p>*/}
                                    {/*        </li>*/}
                                    {/*        {*/}
                                    {/*            service.payment.paid_at &&*/}
                                    {/*            <li>*/}
                                    {/*                <p className={styles.label}>Payment Time:</p>*/}
                                    {/*                <p className={styles.value}>{service.payment.paid_at}</p>*/}
                                    {/*            </li>*/}
                                    {/*        }*/}
                                    {/*        <li>*/}
                                    {/*            <p className={styles.label}>Payment Method:</p>*/}
                                    {/*            <p className={styles.value}>*/}
                                    {/*                {*/}
                                    {/*                    service.payment.channel == 'paypal' ?*/}
                                    {/*                        <img src="/static/icon/paypal.png" alt="paypal"/>*/}
                                    {/*                        : <></>*/}
                                    {/*                }*/}
                                    {/*            </p>*/}
                                    {/*        </li>*/}
                                    {/*        {*/}
                                    {/*            service.payment.no &&*/}
                                    {/*            <li>*/}
                                    {/*                <p className={styles.label}>Other No:</p>*/}
                                    {/*                <p className={styles.value}>{service.payment.no}</p>*/}
                                    {/*            </li>*/}
                                    {/*        }*/}
                                    {/*    </ul>*/}
                                    {/*}*/}

                                    <ul>
                                        <li>
                                            <p className={styles.label}>Status:</p>
                                            <p className={styles.value}>
                                                {
                                                    service?.status && Services[service.status] ?
                                                        <Tag
                                                            color={Services[service.status].color}>{Services[service.status].label}</Tag> :
                                                        service?.status
                                                }
                                            </p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Pictures:</p>
                                            <p className={styles.value}>
                                                {
                                                    service?.pictures &&
                                                    <Image.PreviewGroup>
                                                        {
                                                            service.pictures.map((item, idx) => (
                                                                <Image src={item} key={idx} height={50} width='auto'/>
                                                            ))
                                                        }
                                                    </Image.PreviewGroup>
                                                }
                                            </p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Reason:</p>
                                            <p className={styles.value}>{service?.reason}</p>
                                        </li>
                                        <li>
                                            <p className={styles.label}>Creation Time:</p>
                                            <p className={styles.value}>{service?.created_at}</p>
                                        </li>
                                    </ul>
                                </Col>
                                <Col span={24} md={16} className={styles.right}>
                                    {
                                        service?.status != 'finish' &&
                                        <div className={styles.status}>
                                            <div className={styles.operate}>
                                                <ul>
                                                    {
                                                        service?.status == 'confirm_user' &&
                                                        <li>
                                                            <Button type='primary' ghost onClick={onReceipt}>
                                                                Confirm Receipt
                                                            </Button>
                                                        </li>
                                                    }
                                                    {
                                                        service?.status == 'user' &&
                                                        <li>
                                                            <Button type='primary'
                                                                    onClick={onDispatch}>Dispatch</Button>
                                                        </li>
                                                    }
                                                    {
                                                        service?.status == 'pending' &&
                                                        <li>
                                                            <Button type='primary' onClick={onCancel} danger
                                                                    loading={loading.cancel}>Cancel</Button>
                                                        </li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    }

                                    <div className={styles.tracking}>
                                        <Timeline
                                            mode='left'
                                            items={service?.logs.map(item => ({
                                                label: item.created_at,
                                                children: item.content,
                                            }))}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Spin>
            </div>
            <Dispatch open={dispatch} id={service?.id}
                      onSuccess={() => {
                          setDispatch(false)
                          toService()
                      }} onCancel={() => setDispatch(false)}
            />
        </ConfigProvider>
    )
}