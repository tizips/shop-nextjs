import Link from "next/link";
import {Badge, Button, ConfigProvider} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";

import styles from './index.module.scss';

import Menu from '@/components/layout/menu';
import Search from '@/components/layout/search';
import Login from '@/components/layout/login';
import User from "@/components/layout/user";
import {doSetting} from "@/app/actions/setting";

export default async function () {

    const setting = await doSetting()

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorText: '#fff',
                    },
                }
            }}
        >
            <div className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <h1>
                                <Link href='/'>
                                    {
                                        setting['logo'] ?
                                            <img src={setting['logo']} alt={setting['title']}/>
                                            : setting['title']
                                    }
                                </Link>
                            </h1>
                        </div>
                    </div>
                    <Menu/>
                    <div className={styles.operate}>
                        <div className={styles.inner}>
                            <Search/>
                            <Badge count={0} size='small'>
                                <Link href='/cart'>
                                    <Button type='text' icon={<ShoppingCartOutlined/>}/>
                                </Link>
                            </Badge>
                            <Login/>
                            <User/>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    )
}