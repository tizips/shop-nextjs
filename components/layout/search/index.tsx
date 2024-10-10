'use client'

import {useState} from "react";
import {Button, ConfigProvider, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

import styles from './index.module.scss';

export default function () {

    const [active, setActive] = useState(false);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Input: {
                        borderRadius: 0,
                    }
                }
            }}
        >
            <div className={styles.main}>
                <Button type='text' icon={<SearchOutlined/>} onClick={() => setActive(!active)}/>
                <div className={`${styles.container} ${active ? styles.active : ''}`}>
                    <Input.Search placeholder='Search Product...'/>
                </div>
            </div>
        </ConfigProvider>
    )
}