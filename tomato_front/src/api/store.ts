import { axios } from '../utils/request'

// 引入STORE_MODULE常量，可能是API的前缀部分，方便统一管理
import { STORE_MODULE } from './_prefix'

// 定义一个类型，用于表示商店信息
type StoreInfo = {
    name: string, // 商店名称
    location: string, // 商店位置
    logoUrl: string // 商店Logo的URL地址
}
// 创建商店的API请求
// 该函数接收一个类型为StoreInfo的参数，用于发送创建商店的请求
export const createStore = (storeInfo: StoreInfo) => {
    // 使用axios发送POST请求，URL为STORE_MODULE后接斜杠，并传递商店信息
    return axios.post(`${STORE_MODULE}/`, storeInfo, 
        { headers: { 'Content-Type': 'application/json' } } // 请求头，表示请求体是JSON格式
    )
    .then(res => { // 请求成功后的回调
        return res // 返回响应结果
    })
}

// 获取所有商店的API请求
// 该函数用于获取系统中所有商店的信息
export const getAllStore = () => {
    // 发送GET请求，请求URL为STORE_MODULE后接`/all`，获取所有商店信息
    return axios.get(`${STORE_MODULE}/all`)
        .then(res => { // 请求成功后的回调
            return res // 返回响应结果
        })
}

// 根据商店ID获取指定商店的API请求
// 该函数接收一个storeId参数，用于根据ID查询指定商店的信息
export const getStoreById = (storeId: number) => {
    // 发送GET请求，请求URL为STORE_MODULE后接指定商店ID的路径，获取指定商店信息
    return axios.get(`${STORE_MODULE}/${storeId}`)
        .then(res => { // 请求成功后的回调
            return res // 返回响应结果
        })
}

// 根据商店ID获取商店的商品评分信息
// 该函数接收一个storeId参数，用于查询指定商店的商品评分信息
export const getRatingInfoById = (storeId: number) => {
    // 发送GET请求，请求URL为STORE_MODULE后接商店ID和`/rating`，获取商店商品的评分信息
    return axios.get(`${STORE_MODULE}/${storeId}/rating`)
        .then(res => { // 请求成功后的回调
            return res // 返回响应结果
        })
}
