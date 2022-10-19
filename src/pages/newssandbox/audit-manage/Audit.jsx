import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Table, Button, notification } from 'antd'
export default function Audit() {
  const [dataSource, setdataSource] = useState()
  //token中获得用户的权限和区域，控制用户页面的显示
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {

    const roleObj = {
      "1": "超级管理员",
      "2": "区域管理员",
      "3": "区域编辑",
    }
    // 1正在审核中      
    axios.get(`news?auditState=1&_expand=category`)
      .then(res => {
        const list = res.data
        //如果是超级管理员全部都可以审核，如果不是的话只能审核在同区域下的区域编辑
        setdataSource(roleObj[roleId] === "超级管理员" ? list : [
          // ...list.filter(item => item.author !== username&&item.region === region),
          ...list.filter(item => item.author !== username && item.region === region && roleObj[item.roleId] === "区域编辑"),
        ])
      })
  }, [roleId, region, username])

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'label',
      render: (label, item) => {
        return <a href={`/news-manage/preview/${item.id}`} >{label}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.label}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' onClick={() => handleAudit(item, 2, 1)} >通过</Button>
          <Button danger onClick={() => handleAudit(item, 3, 0)} >驳回</Button>
        </div>
      }
    },
  ]
  const handleAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`news/${item.id}`, {
      auditState,
      publishState,
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `你可以到审核管理/审核列表中查看审核状态`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          //一页5个
          pageSize: 5
        }}
        //数据中没有key属性，需要key值，设置为id
        rowKey={item => item.id}
      />
    </div>
  )
}
