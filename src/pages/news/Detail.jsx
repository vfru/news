import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { useParams } from 'react-router-dom'
import '../newssandbox/news-manage/News.moudule.css'
import moment from 'moment'
import axios from 'axios';
export default function Detail() {
    const params = useParams()
    const [news, setnews] = useState(null)
    useEffect(() => {

        axios.get(`news/${params.id}?_expand=category&_expand=role`).then(res => {

            setnews(
                {
                    ...res.data,
                    view: res.data.view + 1
                }
            )
            // 同步后端
            return res.data
        }).then(res => {
            axios.patch(`news/${params.id}`, {
                view: res.view + 1
            })
        })
    }, [params.id])

    const toheart = () => {
        // 后端
        axios.patch(`news/${params.id}`, {
            star: news.star + 1
        })
        // 前端
        setnews({
            ...news,
            star: news.star + 1
        })

    }
    return (
        <div>
            {
                // news不为假时才渲染
                news && <div className="site-page-header-ghost-wrapper">
                    <PageHeader
                        // 返回上一页
                        onBack={() => window.history.back()}
                        title={news.label}
                        subTitle={<div>{news.category.label}  <HeartTwoTone twoToneColor="#eb2f96" onClick={() => toheart()} /></div>}

                    >
                        <Descriptions size="small" column={3}>

                            <Descriptions.Item label="创建者">{news.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{news.publishTime ? moment(news.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{news.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{news.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{news.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{ __html: news.content }} style={{ border: "1px solid black", margin: "0 24px" }} >

                    </div>
                </div>}
        </div>
    )
}
