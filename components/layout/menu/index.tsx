'use client'

import {useEffect, useState} from "react";
import {Button, ConfigProvider, Menu} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import Link from "next/link";

import styles from "./index.module.scss";

export default function () {

    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState(false);

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
        <div className={styles.main}>
            <div className={styles.toggle}>
                <Button type='text' icon={<MenuOutlined/>} onClick={() => setActive(!active)}
                        className={styles.btn}/>
            </div>
            <div className={`${styles.collapse} ${collapsed && active ? styles.active : ''}`}>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                horizontalLineHeight: 'var(--height)',
                                darkItemBg: collapsed ? 'var(--background)' : '',
                                itemColor: 'var(--color-font)',
                                itemHoverColor: 'var(--color-active)',
                            }
                        }
                    }}
                >
                    <Menu mode={collapsed ? 'inline' : 'horizontal'}
                          theme='dark'
                          className={styles.nav}
                          selectable={false}
                          items={[
                              {key: 'home', label: <Link href='/'>HOME</Link>},
                              {
                                  key: 'store', label: <Link href='/products'>PRODUCTS</Link>,
                                  // popupClassName: styles.menu_popup,
                                  // children: [
                                  //     {key: 'clothing', label: <Link href='/shop'>CLOTHING</Link>},
                                  //     {key: 'tool', label: <Link href='/shop'>TOOL</Link>},
                                  // ]
                              },
                              {key: 'blog', label: <Link href='/blogs'>BLOG</Link>},
                              {key: 'about', label: <Link href='/about'>ABOUT</Link>},
                              // {key: 'contact', label: <Link href='/contact'>CONTACT</Link>},
                          ]}
                    />
                </ConfigProvider>
            </div>
        </div>
    )
}