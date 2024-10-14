import React, {useEffect, useState} from "react";
import {Divider, Form, Input, message, Modal, notification, Rate, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './index.module.scss'

export default function (props: COMOrderFeedback.Props) {

    const {data: session} = useSession()

    const [form] = Form.useForm<COMOrderFeedback.Form>();
    const [loading, setLoading] = useState(false);

    const pictures = Form.useWatch('pictures', form)

    const onUpload = (e: any) => {
        if (Array.isArray(e)) return e;

        if (e.file.status == 'done') {

            const {uid, response}: { uid: string; response?: API.Response<API.Upload> } = e.file;

            e.fileList?.forEach((item: any) => {

                if (item.uid == uid) {

                    if (!response || response.code !== Constants.Success) {
                        notification.error({message: response?.message ?? 'Upload failed, please try again later'});
                        item.status = 'error'
                    } else {
                        item.thumbUrl = response.data.url;
                    }
                }
            });
        }

        return e && e.fileList;
    };

    const toFeedback = async (body: COMOrderFeedback.Submit) => {

        setLoading(true)

        try {
            const response = await fetch('/api/appraisal', {
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

                notification.success({message: 'Order review submitted successfully. Thank you for your sharing!'})

                props.onSuccess?.()
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = (values: COMOrderFeedback.Form) => {

        let body: COMOrderFeedback.Submit = {
            id: props.id,
            star_product: values.star_product,
            star_shipment: values.star_shipment,
            pictures: [],
            remark: values.remark,
        }

        if (values.pictures) {

            for (const item of values.pictures) {
                if (item.status == 'done') {
                    body.pictures.push(item.thumbUrl)
                }
            }
        }

        toFeedback(body)
    }

    useEffect(() => {

        if (props.open) {

            form.resetFields();

            let body: COMOrderFeedback.Form = {
                star_shipment: undefined,
                star_product: undefined,
                remark: undefined,
                pictures: [],
            }

            form.setFieldsValue(body);
        }

    }, [props.open])

    return (
        <Modal
            title='Order Review'
            centered
            open={props.open}
            maskClosable={false}
            onOk={form.submit}
            onCancel={props.onCancel}
            confirmLoading={loading}
            className={styles.main}
        >
            <Divider/>
            <Form form={form} onFinish={onSubmit} layout='vertical'>

                <Form.Item label='Product Review' name='star_product' rules={[{required: true}]}>
                    <Rate/>
                </Form.Item>
                <Form.Item label='Courier Review' name='star_shipment' rules={[{required: true}]}>
                    <Rate/>
                </Form.Item>
                <Form.Item label='Detailed Review' name='remark' rules={[{required: true}]}>
                    <Input.TextArea maxLength={255} showCount/>
                </Form.Item>
                <Form.Item label="Pictures" name='pictures' valuePropName="fileList" getValueFromEvent={onUpload}
                           help='Upload images to share your shopping experience results.'>
                    <Upload action='/api/upload/file' maxCount={8} listType="picture-card" className={styles.upload}
                            beforeUpload={(file) => {
                                const size = file.size / 1024 / 1024 <= 2;
                                if (!size) {
                                    message.error('Image size must be less than 2MB.');
                                    return Upload.LIST_IGNORE
                                }
                                return size;
                            }}
                            headers={{Authorization: session?.jwt as string}}
                            data={{dir: '/service'}}
                    >
                        {
                            pictures && pictures.length < 8 &&
                            <button className={styles.button}>
                                <PlusOutlined/>
                            </button>
                        }
                    </Upload>
                </Form.Item>
            </Form>
            <Divider/>
        </Modal>
    )
}