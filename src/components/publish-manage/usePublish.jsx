import axios from 'axios'
import { useState, useEffect } from 'react'
import { notification } from 'antd'

function usePublish(type) {
    const [dataSource, setdataSource] = useState()
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        // publishState=2是已发布      
        axios.get(`news?author=${username}&publishState=${type}&_expand=category`)
            .then(res => {
                const list = res.data
                setdataSource(list)
            })
    }, [username, type])

    //发布
    const handlePublish = (id) => {
        //过滤出没选中的
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`news/${id}`, {
            //已发布
            publishState: 2,
            publishTime:Date.now()
          }).then(res => {
            notification.info({
              message: `通知`,
              description: `你可以到发布管理中/已发布查看`,
              placement: 'bottomRight',
            });
          })
    }

    //下线
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`news/${id}`, {
            //已发布
            publishState: 3,
          }).then(res => {
            notification.info({
              message: `通知`,
              description: `你可以到发布管理中/已下线查看`,
              placement: 'bottomRight',
            });
          })
    }

    //删除
    const handleDelete = (id) => {
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`news/${id}`)
        .then(res => {
            notification.info({
              message: `通知`,
              description: `你已经删除了已下线的新闻`,
              placement: 'bottomRight',
            });
          })
    }


    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish