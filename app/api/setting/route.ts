import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";
import {NextResponse} from "next/server";

export async function GET(req: any) {

    const search = new URLSearchParams({module: 'shop'});

    const values = doSign(search.toString())

    try {

        const response = await Axios().request<any, AxiosResponse<API.Response<any>>>({
            method: 'GET',
            url: '/common/setting',
            params: new URLSearchParams(values),
        })

        return NextResponse.json(response.data)

    } catch (err) {
        throw err
    }
}