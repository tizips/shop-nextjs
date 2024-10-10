import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doBlogs(params: URLSearchParams) {

    let data: API.Paginate<API.Blogs> = {
        page: 1,
        size: 15,
        total: 0,
        data: [],
    }

    const values = doSign(params.toString())

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Paginate<API.Blogs>>>>('/shop/blogs', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}

export async function doBlog(id: string) {

    let data: API.Blog | undefined

    const values = doSign()

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Blog>>>(`/shop/blogs/${id}`, {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}
