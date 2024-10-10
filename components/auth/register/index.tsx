'use client'

import {useEffect} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Button, Form, Input, Space} from "antd";
import {UserAddOutlined} from "@ant-design/icons";

import styles from './index.module.scss';

export default function (props: COMAuthRegister.Props) {

    const [form] = Form.useForm<COMAuthRegister.Form>()

    const search = useSearchParams()

    useEffect(() => {

        form.resetFields()

        form.setFieldsValue({
            email: undefined,
            first_name: undefined,
            last_name: undefined,
            password: undefined,
            password_confirm: undefined,
        })

    }, []);

    return (
        <div className={styles.main}>

            <Form form={form} layout="vertical" onFinish={props.onFinish}>
                <Form.Item label='Email' name='email' rules={[{required: true, type: 'email'}]}>
                    <Input placeholder='Email Address'/>
                </Form.Item>
                <Form.Item label='Name' required>
                    <Space>
                        <Form.Item label='First Name' name='first_name' rules={[{required: true}]} noStyle>
                            <Input placeholder='FirstName'/>
                        </Form.Item>
                        <Form.Item label='Last Name' name='last_name' rules={[{required: true}]} noStyle>
                            <Input placeholder='FirstName'/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item label='Password' name='password' rules={[{required: true}]}>
                    <Input.Password placeholder='Password'/>
                </Form.Item>
                <Form.Item
                    name="password_confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item>
                    <Button icon={<UserAddOutlined/>} type="primary" htmlType='submit' block loading={props.loading}>Sign Up</Button>
                </Form.Item>
                <ul>
                    <li>
                        <span>Already have an account? </span>
                        <Link href={{pathname: '/login', query: search.toString()}}>Log in</Link>
                        <span> here.</span>
                    </li>
                </ul>
            </Form>
        </div>
    )
}