'use client'

import {useEffect, useState} from "react";
import {Button, Drawer} from "antd";
import {FilterOutlined} from "@ant-design/icons";

import styles from './index.module.scss';

import Search from '@/components/product/search';

export default function ({categories}: { categories: API.Categories[] }) {

    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState<boolean>(false);

    const onResize = () => {
        if (window.document.documentElement.clientWidth <= 768) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }

        setActive(false);
    }

    useEffect(() => {

        onResize()

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);

    return (
        <>
            <div className={styles.main}>
                <Button type='primary' icon={<FilterOutlined/>} onClick={() => setActive(true)}/>
            </div>
            <Drawer
                width='100%'
                open={collapsed && active}
                placement='left'
                onClose={() => setActive(false)}
            >
                <Search categories={categories}/>
            </Drawer>
        </>
    )
}