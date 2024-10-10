'use client'

import {useEffect} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Button, Form, Input} from "antd";
import {LoginOutlined} from "@ant-design/icons";

import styles from './index.module.scss';

export default function (props: COMAuthLogin.Props) {

    const [form] = Form.useForm<COMAuthLogin.Form>()

    const search = useSearchParams()

    useEffect(() => {

        form.resetFields()

        form.setFieldsValue({
            email: undefined,
            password: undefined,
        })

    }, []);

    return (
        <div className={styles.main}>

            <Form form={form} layout="vertical" onFinish={props.onFinish}>
                <Form.Item label='Email' name='email' rules={[{required: true, type: 'email'}]}>
                    <Input placeholder='Email Address'/>
                </Form.Item>
                <Form.Item label='Password' name='password' rules={[{required: true}]}>
                    <Input.Password placeholder='Password'/>
                </Form.Item>
                <ul>
                    <li>
                        <Link href={{pathname: '/register', query: search.toString()}}>Sign up</Link>
                    </li>
                    <li>
                        <Link href={{pathname: '/forget', query: search.toString()}}>Forget password</Link>
                    </li>
                </ul>
                <Form.Item>
                    <Button icon={<LoginOutlined/>} type="primary" htmlType='submit' block loading={props.loading}>Sign
                        In</Button>
                </Form.Item>
            </Form>
        </div>
    )
}