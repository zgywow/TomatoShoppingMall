import { createRouter, createWebHashHistory } from "vue-router"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: () => import('../views/user/Login.vue'),
        meta: { title: '用户登录' }
    }, {
        path: '/register',
        component: () => import('../views/user/Register.vue'),
        meta: { title: '用户注册' }
    }, {
        path: '/home',
        redirect: '/dashboard',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/user/Dashboard.vue'),
                meta: { title: '个人信息' }
            },
        ]
    }, {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: { title: '404' }
    }, {
        path: '/:catchAll(.*)',
        redirect: '/404'
    },
    {
        path: '/allStore',
        name: 'allStore',
        component: () => import('../views/store/AllStore.vue'),
        meta: { title: '商品列表界面/主页' }
    },
    //商店列表
    {
        path: '/storeDetail/:storeId',
        name: 'storeDetail',
        component: () => import('../views/store/StoreDetail.vue'),
        meta: { title: '店铺详情' }
    },
    //管理员创建商店
    {
        path: '/createStore',
        name: 'createStore',
        component: () => import('../views/store/CreateStore.vue'),
        meta: {
            title: '创建商店',
            permission: ['MANAGER']
        }
    },
    //商家创建商品
    {
        path: '/createProduct/:storeId',
        name: 'createProduct',
        component: () => import('../views/product/CreateProduct.vue'),
        meta: {
            title: '创建商品',
            permission: ['STAFF']
        }
    },{
        path: '/productDetail/:productId',
        name: 'productDetail',
        component: () => import('../views/product/ProductDetail.vue'),
        meta: { title: '商品详情' }
    }]
})

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');
    const role: string | null = sessionStorage.getItem('role')

    if (to.meta.title) {
        document.title = to.meta.title
    }

    if (token) {
        if (to.meta.permission) {
            if (to.meta.permission.includes(role!)) {
                next()
            } else {
                next('/404')
            }
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next();
        } else if (to.path === '/register') {
            next()
        } else {
            next()
        }
    }
})

export { router }
