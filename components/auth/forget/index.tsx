'use client'

import {useEffect} from "react";
import {Button, Form, Input} from "antd";

import styles from './index.module.scss';

export default function () {

    const [form] = Form.useForm<COMAuthForget.Form>()

    useEffect(() => {

        form.resetFields();

        form.setFieldsValue({email: undefined});

    }, []);

    return (
        <div className={styles.main}>

            <Form form={form} layout="vertical">
                <Form.Item label='Email' name='email' rules={[{required: true}]}>
                    <Input placeholder='Email Address'/>
                </Form.Item>
                <Form.Item wrapperCol={{span: 12}}>
                    <Button type="primary" htmlType='submit' block>Send Code</Button>
                </Form.Item>
            </Form>
        </div>
    )
}