'use client'

import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {Button, Modal, notification} from "antd";
import {UserOutlined} from "@ant-design/icons";

import styles from './index.module.scss';

import Login from '@/components/auth/login';
import {signIn, useSession} from "next-auth/react";

export default function () {

    const {status} = useSession()

    const pathname = usePathname();

    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const onLogin = async (data: any) => {

        setLoading(true)

        try {

            const res = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            })

            if (res?.error) {
                throw new Error(res?.error);
            }

            notification.success({message: "Welcome back!"})
            setActive(false)

        } catch (e) {
            console.error(e)
            // @ts-ignore
            notification.error({message: e.message})
        } finally {
            setLoading(false)
        }
    }

    const onFinish = (values: COMAuthLogin.Form) => {
        onLogin(values)
    }

    useEffect(() => {
        setActive(false);
    }, [pathname]);

    return (
        status == 'unauthenticated' &&
        <>
            <div className={styles.main}>
                <Button type='text' icon={<UserOutlined/>} onClick={() => setActive(true)}
                        disabled={pathname == '/forget'}/>
            </div>
            <Modal
                width={360}
                open={active}
                centered
                footer={null}
                maskClosable={false}
                onCancel={() => setActive(false)}
                className={styles.medal}
            >
                <h3 className={styles.title}>Sign In</h3>
                <Login onFinish={onFinish} loading={loading}/>
            </Modal>
        </>
    )
}