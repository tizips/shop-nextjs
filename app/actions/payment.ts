import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doPaypalOfDone(search: URLSearchParams) {

    const values = doSign(search.toString())

    const response = await Axios().request<any, AxiosResponse<API.Response<API.PayPalDone>>>({
        method: 'POST',
        url: '/shop/notify/paypal',
        params: new URLSearchParams(values),
    })

    if (response.data.code != Constants.Success) {
        throw new Error(response.data.message || 'Login failed'); // 抛出错误信息
    }

    return response.data
}