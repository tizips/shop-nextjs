import React, {useEffect, useState} from "react";
import {Col, Divider, Form, Image, Input, InputNumber, message, Modal, notification, Radio, Row, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './index.module.scss'

export default function (props: COMServiceDispatch.Props) {

    const {data: session, status} = useSession()

    const [form] = Form.useForm<COMServiceDispatch.Form>();
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);

    const toSetting = async () => {

        setLoad(true)

        try {

            const response = await fetch('/api/setting', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response) {

                const resp: API.Response<Record<string, string>> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message)
                }

                let body: COMServiceDispatch.Form = {
                    user: resp.data['return_user'],
                    phone: resp.data['return_phone'],
                    address: resp.data['return_address'],
                }

                form.setFieldsValue(body)
            }
        } catch (e: any) {
            notification.error({message: e.message});
            props.onCancel?.()
        } finally {
            setLoad(false)
        }
    }

    const toShipment = async (body: COMServiceDispatch.Submit) => {

        setLoading(true)

        try {
            const response = await fetch('/api/service/shipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
                body: JSON.stringify(body),
            });

            if (response) {

                const resp: API.Response<any> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                notification.success({message: 'Return shipment information uploaded successfully. Please wait for the seller to process it.'})

                props.onSuccess?.()
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = (values: COMServiceDispatch.Form) => {

        let body: COMServiceDispatch.Submit = {
            id: props.id,
            company: values.company,
            no: values.no,
            remark: values.remark,
        }

        toShipment(body)
    }

    const toInit = () => {

    }

    useEffect(() => {

        if (props.open) {

            form.resetFields();

            let body: COMServiceDispatch.Form = {
                company: undefined,
                no: undefined,
                remark: undefined,
            }

            form.setFieldsValue(body);

            toSetting()
        }

    }, [props.open])

    return (
        <Modal
            title='Returned Shipment'
            centered
            width={680}
            open={props.open}
            maskClosable={false}
            onOk={form.submit}
            onCancel={props.onCancel}
            confirmLoading={loading}
            className={styles.main}
            loading={load}
        >
            <Divider/>
            <Form form={form} onFinish={onSubmit} layout='vertical'>

                <Row gutter={[10, 10]}>
                    <Col span={12}>
                        <Form.Item label='User' name='user'>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item label='Phone' name='phone'>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item label='Address' name='address'>
                            <Input.TextArea disabled/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label='Company' name='company' rules={[{required: true, max: 64}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='No' name='no' rules={[{required: true, max: 64}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='Remark' name='remark' rules={[{max: 255}]}>
                            <Input.TextArea showCount maxLength={255}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}