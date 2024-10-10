import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doLoginOfEmail(body: any) {

    let data: API.Auth | undefined

    const values = doSign()

    const response = await Axios().request<any, AxiosResponse<API.Response<API.Auth>>>({
        method: 'POST',
        url: '/basic/login/email',
        params: new URLSearchParams(values),
        data: body,
    })

    if (response.data.code == Constants.Success) {
        data = response.data.data
    }

    if (response.data.code != Constants.Success) {
        throw new Error(response.data.message || 'Login failed'); // 抛出错误信息
    }

    return data
}