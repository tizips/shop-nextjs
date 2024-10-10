import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doBanners() {

    let data: API.Banners[] = []

    const values = doSign()

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Banners[]>>>('/shop/banners', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}