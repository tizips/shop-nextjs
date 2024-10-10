import axios from "axios";
import dayjs from "dayjs";
import {md5} from "js-md5";

export const Axios = () => {

    const req = axios.create({
        baseURL: process.env.DOMAIN,
    })

    return req
}

export const doSign = (query?: string) => {

    const params = new URLSearchParams(query)
    const values = new URLSearchParams(query)

    const date = dayjs().format('YYYY-MM-DD HH:mm:ss')

    params.set('time', date)
    values.set('time', date)

    const key = process.env.API_KEY
    const secret = process.env.API_SECRET

    if (key && secret) {

        params.set('key', key)
        params.set('secret', secret)

        values.set('key', key)
    }

    // @ts-ignore
    for (const k of params.values()) {

        const val = params.get(k)

        if (!val || val == '') {
            params.delete(k)
        }
    }

    params.sort()

    values.set('sign', md5(params.toString()).toUpperCase())

    return values.toString()
}