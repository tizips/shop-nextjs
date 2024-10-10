'use client'

import {useEffect, useState} from "react";
import {Button, InputNumber, notification, Space} from "antd";
import {HeartFilled, ShoppingCartOutlined} from "@ant-design/icons";
import {signIn, useSession} from "next-auth/react";
import Constants from "@/util/Constants";

import styles from './index.module.scss';

export default function (props: {
    id: string,
    sku?: API.SKU,
    specification?: API.Specification;
    price: number;
    origin_price?: number
}) {

    const {data: session, status} = useSession()

    const [price, setPrice] = useState<number>(props.price);
    const [originPrice, setOriginPrice] = useState<number | undefined>(props.origin_price);
    const [sku, setSku] = useState<string | undefined>(props.sku?.id);
    const [quantity, setQuantity] = useState<number>(1)
    const [codes, setCodes] = useState<number[]>([]);
    const [loading, setLoading] = useState<{ cart?: boolean; wishlist?: boolean }>({});

    const toCart = async () => {

        setLoading({...loading, cart: true})

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
                body: JSON.stringify({sku, quantity}),
            });

            if (response) {

                const resp: API.Response<any> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                notification.success({message: 'Success'})
            }
        } catch (e) {
            // @ts-ignore
            notification.error({message: e.message});
        } finally {
            setLoading({...loading, cart: false})
        }
    }

    const toWishlist = async () => {

        setLoading({...loading, wishlist: true})

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session?.jwt
                },
                body: JSON.stringify({id: props.id}),
            });

            if (response) {

                const resp: API.Response<any> = await response.json();

                if (resp.code != Constants.Success) {
                    throw new Error(resp.message);
                }

                notification.success({message: 'Success'})
            }
        } catch (e: any) {
            notification.error({message: e.message});
        } finally {
            setLoading({...loading, wishlist: false})
        }
    }

    const onChoose = (id: number, group: number) => {

        let data = [...codes]

        let groups: number[] = []

        if (props.specification) {
            for (const item of props.specification.specifications) {
                if (item.id == group && item.options) {
                    groups = item.options?.map(value => value.id)
                    break
                }
            }
        }

        if (groups) {
            data = data.filter(item => !groups.includes(item))
        }

        data.push(id)

        setCodes(data)
    }

    const onCart = () => {

        if (status == 'unauthenticated') {
            signIn()
        } else if (status == 'authenticated') {
            toCart()
        }
    }

    const onWishlist = () => {

        if (status == 'unauthenticated') {
            signIn()
        } else if (status == 'authenticated') {
            toWishlist()
        }
    }

    useEffect(() => {
        if (codes) {
            codes.sort((a, b) => a - b)
            const code = codes.join(':')
            if (props.specification?.skus) {
                for (const item of props.specification.skus) {
                    if (item.code == code) {
                        setSku(item.id)
                        setPrice(item.price)
                        setOriginPrice(item.origin_price)
                        break
                    }
                }
            }
        }
    }, [codes])

    return (
        <div className={styles.main}>
            <p className={styles.price}>
                <span>${(price / 100).toFixed(2)}</span>
                {
                    originPrice &&
                    <span className={styles.del}>${(originPrice / 100).toFixed(2)}</span>
                }
            </p>
            {
                props.specification &&
                <div className={styles.attributes}>
                    {
                        props.specification.specifications.map(item => (
                            <div className={styles.group} key={item.id}>
                                <h4>{item.name}</h4>
                                {
                                    item.options &&
                                    <div className={styles.attr}>
                                        <Space>
                                            {
                                                item.options.map(value => (
                                                    <Button
                                                        type={codes.includes(value.id) ? 'primary' : 'dashed'}
                                                        // ghost={codes.includes(value.id)}
                                                        key={value.id}
                                                        onClick={() => onChoose(value.id, item.id)}
                                                    >
                                                        {value.name}
                                                    </Button>
                                                ))
                                            }
                                        </Space>
                                    </div>
                                }
                            </div>
                        ))
                    }
                </div>
            }
            <div className={styles.quantity}>
                <InputNumber min={1} max={99} value={quantity} onChange={v => setQuantity(v ?? 1)}
                             className={styles.input}/>
            </div>
            <div className={styles.operate}>

                {/*<div className={styles.inner}>*/}

                {/*<div className={styles.buy}>*/}
                {/*    <Button*/}
                {/*        type='primary'*/}
                {/*        block*/}
                {/*        onClick={status == "authenticated" ? () => {*/}
                {/*        } : () => signIn()}*/}
                {/*        icon={<ShoppingOutlined/>}>BUY</Button>*/}
                {/*</div>*/}

                <div className={styles.cart}>
                    <Button type='primary' block icon={<ShoppingCartOutlined/>} onClick={onCart} loading={loading.cart}>
                        ADD TO CART
                    </Button>
                </div>
                {/*</div>*/}

                <div className={styles.wish}>
                    <Button icon={<HeartFilled/>} onClick={onWishlist} block loading={loading.wishlist}>ADD TO
                        WISHLIST</Button>
                </div>
            </div>
        </div>
    )
}