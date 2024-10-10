import Link from "next/link";
import {Button, Result} from "antd";
import {doPaypalOfDone} from "@/app/actions/payment";
import Constants from "@/util/Constants";

export default async function ({searchParams}: { searchParams: URLSearchParams }) {

    const search = new URLSearchParams(searchParams);

    let err: string | undefined

    try {

        const resp: API.Response<any> = await doPaypalOfDone(search)

        if (resp.code != Constants.Success) {
            throw new Error(resp.message)
        }

    } catch (e: any) {
        err = e.message
    }

    return (
        <div>
            {
                err ?
                    <Result
                        status='error'
                        title='Payment completion failed'
                        subTitle={err}
                        extra={
                            [
                                <Link href='/'>
                                    <Button key='home' type='primary' ghost>Home</Button>
                                </Link>,
                                <Link href='/orders'>
                                    <Button key='orders' type='primary'>Order List</Button>
                                </Link>
                            ]
                        }
                    /> :
                    <Result
                        status='success'
                        title='Order payment successful'
                        extra={
                            [
                                <Link href='/'>
                                    <Button key='home' type='primary' ghost>Home</Button>
                                </Link>,
                                <Link href='/orders'>
                                    <Button key='orders' type='primary'>Order List</Button>
                                </Link>
                            ]
                        }
                    />
            }
        </div>
    )
}