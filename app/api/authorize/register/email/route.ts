import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";
import {NextResponse} from "next/server";

export async function POST(req: any) {

    let error = ''

    const values = doSign()

    try {

        const body = await req.json()

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Auth>>>({
            method: 'POST',
            url: '/basic/register/email',
            params: new URLSearchParams(values),
            data: body,
        })

        if (response.data.code != Constants.Success) {
            error = response.data.message
        }

    } catch (err) {
    }

    return NextResponse.json({error})
}
