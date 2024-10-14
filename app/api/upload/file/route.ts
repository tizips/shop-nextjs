import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function POST(req: Request) {

    const values = doSign()

    try {

        const body = await req.formData()
        // const body = await req.json()
        console.info(body)

        const response = await Axios().request<any, AxiosResponse<API.Response<API.PlaceOrder>>>({
            method: 'POST',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: '/basic/upload/file',
            params: new URLSearchParams(values),
            data: body,
        })

        return NextResponse.json(response.data)

    } catch (e) {
        throw e
    }

}