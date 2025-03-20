import { axios } from '../utils/request'
import { USER_MODULE } from './_prefix'

/**
 * 用户登录类型
 */
type LoginInfo = {
    phone: string,
    password: string
}

/**
 * 用户注册类型（添加邮箱）
 */
type RegisterInfo = {
    name: string,
    email: string,          // 新增邮箱字段
    phone: string,
    password: string,
    address: string,
}

/**
 * 用户信息更新类型
 */
type UpdateInfo = {
    name?: string,
    email?: string,         // 可选邮箱字段
    password?: string,
    address?: string,
}

/**
 * 用户登录
 */
export const userLogin = (loginInfo: LoginInfo) => {
    return axios.post(`${USER_MODULE}/login`, null, { params: loginInfo })
        .then(res => {
            return res
        })
}

// 检查用户名是否存在
export const checkUsername = (name: string) => {
    return axios.get(`${USER_MODULE}/check-username`, { params: { name } })
        .then(res => res)
}


/**
 * 用户注册（支持邮箱）
 */
export const userRegister = (registerInfo: RegisterInfo) => {
    return axios.post(`${USER_MODULE}/register`, registerInfo, {
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        return res
    })
}

/**
 * 获取用户信息
 */
export const userInfo = () => {
    return axios.get(`${USER_MODULE}`)
        .then(res => {
            return res
        })
}

/**
 * 更新用户信息
 */
export const userInfoUpdate = (updateInfo: UpdateInfo) => {
    return axios.post(`${USER_MODULE}`, updateInfo, {
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        return res
    })
}

/**
 * 邮箱验证功能
 * @param email 用户邮箱
 * @returns 验证邮箱是否已注册或发送验证码
 */
export const userVerifyEmail = (email: string) => {
    return axios.post(`${USER_MODULE}/verify-email`, { email }, {
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        return res
    })
}

/**
 * 通过邮箱重置密码
 * @param email 用户邮箱
 * @param newPassword 新密码
 */
export const userResetPasswordByEmail = (email: string, newPassword: string) => {
    return axios.post(`${USER_MODULE}/reset-password`, {
        email,
        password: newPassword
    }, {
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        return res
    })
}
