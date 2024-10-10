import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function POST(req: Request) {

    const values = doSign()

    try {

        const body = await req.json()

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Paypal>>>({
            method: 'POST',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: '/shop/payment/paypal',
            params: new URLSearchParams(values),
            data: body,
        })

        return NextResponse.json(response.data)

    } catch (e) {
        throw e
    }

}