'use client'

import {Suspense, useState} from "react";
import {useSearchParams} from "next/navigation";
import {notification} from "antd";
import {signIn} from "next-auth/react";
import {useRouter} from "nextjs-toploader/app";

import styles from './page.module.scss';

import Register from "@/components/auth/register";

function Component() {

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

    const onRegister = async (data: any) => {

        setLoading(true)

        try {

            const response = await fetch('/api/authorize/register/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response) {

                const {error} = await response.json();

                if (error) {
                    throw new Error(error);
                }

                const res = await signIn('credentials', {email: data.email, password: data.password})

                if (res?.error) {
                    throw new Error(res?.error);
                }

                onRedirect()
            }

        } catch (error) {
            console.error(error)
            // @ts-ignore
            notification.error({message: error.message || 'Failed to fetch data'})
        } finally {
            setLoading(false);
        }
    }

    const onFinish = (values: COMAuthRegister.Form) => {
        onRegister(values)
    }

    return (
        <div className={styles.main}>
            <h3>Sign Up</h3>
            <div className={styles.container}>
                <Register onFinish={onFinish} loading={loading}/>
            </div>
        </div>
    )
}

export default function () {
    return (
        <Suspense>
            <Component/>
        </Suspense>
    )
}