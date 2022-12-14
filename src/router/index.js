
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
import News from '../pages/news/News';
import Detail from '../pages/news/Detail';
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
        "/publish-manage/sunset": <Sunset />,
        "/news":<News/>,
        "/detail/:id":<Detail/>
    }

    const token = localStorage.getItem('token')

    const checkRoute = (item) => {
        //??????????????????pagepermisson???1????????????????????????,???????????????????????????
        return localRouterMap[item.key] && (item.pagepermission||item.routepermission)
    }
    const checkUserPermission = (item) => {
        //????????????????????????????????????item???key???
        if (token !== null) {
            const { role: { rights: { checked } } } = JSON.parse(token)
            return checked.includes(item.key)
        }


    }

    const routes = [
        {
            path: '/news', element: <News />
        },
        {
            path: '/detail/:id', element: <Detail />
        },
        {
            path: '/login', element: <Login />
        },
        {
            path: '/', element: (token !== null ? <NewsSandBox /> : <Navigate to='/login' />),
            children: [
                ...BackRouteList.map(item => {
                    //?????????????????????????????????????????????
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
        //?????????BackRouteList??????????????????????????????????????????403
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
