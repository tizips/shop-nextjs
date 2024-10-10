import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doShippings() {

    let data: API.Shippings[] = []

    const values = doSign()

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Shippings[]>>>('/shop/shippings', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}