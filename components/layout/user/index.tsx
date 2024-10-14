'use client'

import React from "react";
import {signOut, useSession} from "next-auth/react";
import {Button, ConfigProvider, Dropdown, Modal, notification} from "antd";
import {AuditOutlined, CoffeeOutlined, HeartOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";

import styles from './index.module.scss';
import Link from "next/link";
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";


export default function () {

    const [modal, contextHolder] = Modal.useModal();

    const {status} = useSession()

    const toLogout = async () => {
        await signOut()
        notification.success({message: "Looking forward to your return!"})
    }

    const onLogout = () => {
        modal.confirm({
            icon: <LogoutOutlined/>,
            centered: true,
            title: 'Log out',
            content: (
                <>
                    <br/>
                    <span>Are you sure you want to sign out? We'll miss you!</span>
                    <br/>
                    <br/>
                </>
            ),
            onOk: toLogout
        })
    }

    return (
        status == 'authenticated' &&
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            colorText: 'var(--color)',
                        },
                    }
                }}>
                {contextHolder}
            </ConfigProvider>
            <div className={styles.main}>
                <Dropdown menu={{
                    items: [
                        {
                            key: 'orders',
                            icon: <AuditOutlined/>,
                            label: <Link href='/orders'>Orders</Link>
                        },
                        {
                            key: 'services',
                            icon: <CoffeeOutlined />,
                            label: <Link href='/services'>After-Sales</Link>
                        },
                        {
                            key: 'wishlist',
                            icon: <HeartOutlined/>,
                            label: <Link href='/wishlist'>Wishlist</Link>
                        },
                        {
                            key: 'logout',
                            icon: <LogoutOutlined/>,
                            label: <span onClick={onLogout}>Logout</span>
                        }
                    ]
                }} placement="bottomRight">
                    <Button type='text' icon={<UserOutlined/>}/>
                </Dropdown>
            </div>
        </>
    )
}