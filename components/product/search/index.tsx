'use client'

import {Button, ConfigProvider, Input, Menu, Slider} from "antd";

import {useState} from "react";
import Link from "next/link";
import {DoubleRightOutlined} from "@ant-design/icons";

import styles from './index.module.scss';

export default function ({categories}: { categories: API.Categories[] }) {

    const [amounts, setAmounts] = useState<number[]>();

    return (
        <div className={styles.main}>

            <ConfigProvider
                theme={{
                    components: {
                        Input: {
                            borderRadius: 0,
                        },
                        Button: {
                            borderRadius: 0,
                            paddingInline: 35,
                            fontSize: 12,
                        },
                        Menu: {
                            fontSize: 13,
                            fontWeightStrong: 400,
                            itemHeight: 30,
                            iconSize: 8,
                            itemPaddingInline: 0,
                        }
                    }
                }}
            >
                <div className={styles.search}>
                    <Input placeholder='Search Product...' className={styles.input}/>
                    <Button type='primary'>SEARCH</Button>
                </div>

                {/*<div className={styles.amount}>*/}
                {/*    <h3>FILTER BY PRICE</h3>*/}
                {/*    <Slider range min={1} max={500} onChange={values => setAmounts(values)} className={styles.slider}/>*/}
                {/*    <div className={styles.inner}>*/}
                {/*        <Button type='primary'>FILTER</Button>*/}
                {/*        {*/}
                {/*            amounts && amounts.length > 0 ? (*/}
                {/*                <span>Price: ${amounts[0]} - ${amounts[1]}</span>*/}
                {/*            ) : (*/}
                {/*                <span>Price: $0 - $500</span>*/}
                {/*            )*/}
                {/*        }*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className={styles.category}>
                    <h3>PRODUCT CATEGORIES</h3>
                    <Menu
                        mode='inline'
                        theme='light'
                        className={styles.menu}
                        items={categories.map(item => ({
                            key: item.id,
                            icon: <DoubleRightOutlined/>,
                            label: <Link href={{pathname: '/products', query: `category=${item.id}`}}>{item.name}</Link>
                        }))}
                    />
                </div>
            </ConfigProvider>
        </div>
    )
}