import React, {useEffect, useState} from "react";
import {Divider, Form, Image, Input, InputNumber, message, Modal, notification, Radio, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './index.module.scss'

export default function (props: COMOrderService.Props) {

    const {data: session, status} = useSession()

    const [form] = Form.useForm<COMOrderService.Form>();
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

    const toService = async (body: COMOrderService.Submit) => {

        setLoading(true)

        try {
            const response = await fetch('/api/order/service', {
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

                notification.success({message: 'After-sales request submitted successfully. Please wait for the seller to process it.'})

                props.onSuccess?.()
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = (values: COMOrderService.Form) => {

        let body: COMOrderService.Submit = {
            id: props.id,
            type: values.type,
            pictures: [],
            details: [],
            reason: values.reason,
        }

        for (const item of values.details) {
            if (item.quantity > 0) {
                body.details.push(item)
            }
        }

        if (body.details.length == 0) {
            notification.error({message: ''})
            return
        }

        if (values.pictures) {

            for (const item of values.pictures) {
                if (item.status == 'done') {
                    body.pictures.push(item.thumbUrl)
                }
            }
        }

        toService(body)
    }

    useEffect(() => {

        if (props.open) {

            form.resetFields();

            let body: COMOrderService.Form = {
                type: props.status != 'receipt' ? 'un_receipt' : 'refund',
                details: [],
                pictures: [],
                reason: undefined,
            }

            if (props.details) {
                for (const item of props.details) {
                    body.details.push({
                        id: item.id,
                        quantity: item.quantity - item.returned,
                    })
                }
            }

            form.setFieldsValue(body);
        }

    }, [props.open, props.details])

    return (
        <Modal
            title='After-Sales'
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
                <Form.Item label='type' name='type' labelCol={{span: 0}}>
                    <Radio.Group
                        block
                        options={[
                            {label: 'Not Received', value: 'un_receipt', disabled: props.status == 'receipt'},
                            {label: 'Return and Refund', value: 'refund', disabled: props.status != 'receipt'},
                            {label: 'Exchange', value: 'exchange', disabled: props.status != 'receipt'},
                        ]}
                        buttonStyle='solid'
                        optionType='button'
                    />
                </Form.Item>
                <Form.List name="details">
                    {(fields) => (
                        <table>
                            <tbody>
                            {
                                fields.map(({key, name, ...restField}) => (
                                    <tr key={key}>
                                        <td width={70}>
                                            <Image src={props.details[key].picture} alt={props.details[key].name}
                                                   width={50} height={50}/>
                                        </td>
                                        <td>
                                            <h3>{props.details[key].name}</h3>
                                            {
                                                props.details[key].specifications &&
                                                <div className={styles.tag}>
                                                    <div className={styles.inner}>
                                                        {props.details[key].specifications?.join('; ')}
                                                    </div>
                                                </div>
                                            }
                                            <Form.Item  {...restField} name={[name, 'quantity']} noStyle
                                                        rules={[{required: true}]}>
                                                <InputNumber size='small' min={0}
                                                             disabled={!!props.details[key].service || props.details[key].quantity - props.details[key].returned == 0}
                                                             max={props.details[key].quantity - props.details[key].returned}/>
                                            </Form.Item>
                                            <Form.Item  {...restField} name={[name, 'id']} hidden
                                                        rules={[{required: true}]}>
                                                <Input/>
                                            </Form.Item>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    )}
                </Form.List>
                <Form.Item label='reason' name='reason' labelCol={{span: 0}} rules={[{required: true}]}>
                    <Input.TextArea placeholder='Please enter your reason (required).'/>
                </Form.Item>
                <Form.Item label="pictures" name='pictures' valuePropName="fileList" getValueFromEvent={onUpload}
                           labelCol={{span: 0}}
                           help='Please upload an image here to help us better understand the situation.'>
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