import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";
import {NextResponse} from "next/server";

export async function POST(req: any) {

    const values = doSign()

    try {

        const body = await req.json()

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Auth>>>({
            method: 'POST',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: '/shop/cart',
            params: new URLSearchParams(values),
            data: body,
        })

        return NextResponse.json(response.data)

    } catch (err) {
        throw err
    }
}