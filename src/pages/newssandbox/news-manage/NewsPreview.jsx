import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import { useParams } from 'react-router-dom'
import './News.moudule.css'
import moment from 'moment'
import axios from 'axios';
export default function NewsPreview() {
  const params = useParams()
  const [news, setnews] = useState(null)
  useEffect(() => {

    axios.get(`news/${params.id}?_expand=category&_expand=role`).then(res => {
      setnews(res.data)
    })
  }, [params.id])
  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const publishList = ["未发布", "待发布", "已上线", "已下线"]
  const colorList = ["black","orange","green","red"]
  return (
    <div>
      {
        // news不为假时才渲染
        news && <div className="site-page-header-ghost-wrapper">
          <PageHeader
          // 返回上一页
            onBack={() => window.history.back()}
            title={news.label}
            subTitle={news.category.label}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{news.author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{moment(news.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{news.publishTime ? moment(news.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
              <Descriptions.Item label="区域">{news.region}</Descriptions.Item>
              <Descriptions.Item label="审核状态"><span style={{color:colorList[news.auditState]}} >{auditList[news.auditState]}</span></Descriptions.Item>
              <Descriptions.Item label="发布状态"><span style={{color:colorList[news.publishState]}} >{publishList[news.publishState]}</span></Descriptions.Item>
              <Descriptions.Item label="访问数量">{news.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{news.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div dangerouslySetInnerHTML={{__html:news.content}} style={{border:"1px solid black",margin:"0 24px"}} >

          </div>
        </div>}
    </div>
  )
}
