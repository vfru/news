
import { Navigate } from 'react-router-dom';
import { useRoutes } from 'react-router-dom'
import Login from '../pages/login/Login'
import NewsSandBox from '../pages/newssandbox/NewsSandBox'
import Home from '../pages/newssandbox/home/Home'
import UserList from '../pages/newssandbox/user-manage/UserList'
import RightList from '../pages/newssandbox/right-manage/RightList'
import RoleList from '../pages/newssandbox/right-manage/RoleList'
import NotFound from '../pages/NotFound'
import NewsAdd from '../pages/newssandbox/news-manage/NewsAdd'
import NewsDraft from '../pages/newssandbox/news-manage/NewsDraft'
import NewsCategory from '../pages/newssandbox/news-manage/NewsCategory'
import NewsPreview from '../pages/newssandbox/news-manage/NewsPreview'
import NewsUpdate from '../pages/newssandbox/news-manage/NewsUpdate'
import Audit from '../pages/newssandbox/audit-manage/Audit'
import AuditList from '../pages/newssandbox/audit-manage/AuditList'
import Unpublished from '../pages/newssandbox/publish-manage/Unpublished'
import Published from '../pages/newssandbox/publish-manage/Published'
import Sunset from '../pages/newssandbox/publish-manage/Sunset'
import { Layout} from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import routes from './routes'


export default function IndexRouter() {
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        //
        Promise.all([
            axios.get("rights"),
            axios.get("children"),
        ]).then(res => {
            // console.log(...res[0].data,...res[1].data)
            setBackRouteList([...res[0].data, ...res[1].data])
        })

    }, [])
    const localRouterMap = {
        '/home': <Home />,
        '/user-manage/list': <UserList />,
        '/right-manage/right/list': <RightList />,
        '/right-manage/role/list': <RoleList />,
        '/news-manage/add': <NewsAdd />,
        '/news-manage/draft': <NewsDraft />,
        '/news-manage/category': <NewsCategory />,
        '/news-manage/preview/:id': <NewsPreview />,
        '/news-manage/update/:id':<NewsUpdate />,
        "/audit-manage/audit": <Audit />,
        "/audit-manage/list": <AuditList />,
        "/publish-manage/unpublished": <Unpublished />,
        "/publish-manage/published": <Published />,
        "/publish-manage/sunset": <Sunset />
    }

    const token = localStorage.getItem('token')

    const checkRoute = (item) => {
        //权限列表中的pagepermisson是1的时候才支持渲染,或者是显示修改页面
        return localRouterMap[item.key] && (item.pagepermission||item.routepermission)
    }
    const checkUserPermission = (item) => {
        //判断当前用户的权限列表和item的key的
        if (token !== null) {
            const { role: { rights: { checked } } } = JSON.parse(token)
            return checked.includes(item.key)
        }


    }

    const routes = [
        {
            path: '/login', element: <Login />
        },
        {
            path: '/', element: (token !== null ? <NewsSandBox /> : <Navigate to='/login' />),
            children: [
                ...BackRouteList.map(item => {
                    //判断所拥有的权限获得相应的页面
                    if (checkRoute(item) && checkUserPermission(item)) {
                        return ({
                            path: item.key,
                            element: localRouterMap[item.key]
                        })
                    } else {
                        return ({
                            path: item.key,
                            element: <NotFound />
                        })
                    }
                }
                ),
                {
                    path: '/', element: <Navigate to='/home' />
                },

            ]
        },
        //开始时BackRouteList为空，数据没回来时会有一瞬间403
        BackRouteList.length > 0 && { path: '*', element: (token !== null ? <NotFound /> : <Navigate to='/login' />) }

    ]
    const element = useRoutes(routes)

    // useEffect(() => {
    //     console.log(token)
    // }, [token])

    return (
        <Layout>
            {element}
        </Layout>
    )
}
