'use client'

import {useState} from "react";
import {useSearchParams} from "next/navigation";
import {notification} from "antd";
import {signIn} from "next-auth/react";
import {useRouter} from "nextjs-toploader/app";

import styles from './page.module.scss';

import Login from '@/components/auth/login';

export default function () {

    const search = useSearchParams()
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const onRedirect = () => {

        let url = '/'

        if (search.has('callbackUrl')) {

            const callback = search.get('callbackUrl');

            if (callback) {
                url = callback
            }
        }

        router.push(url)
    }

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

            onRedirect()

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

    return (
        <div className={styles.main}>
            <h3>Sign In</h3>
            <div className={styles.container}>
                <Login onFinish={onFinish} loading={loading}/>
            </div>
        </div>
    )
}