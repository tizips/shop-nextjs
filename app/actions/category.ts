import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doCategories() {

    let data: API.Categories[] = []

    const values = doSign()

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Categories[]>>>('/shop/categories', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}