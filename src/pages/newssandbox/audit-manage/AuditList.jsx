import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function AuditList() {
  //table组件中的表格数据
  const [dataSource, setdataSource] = useState()
  //table组件中的表格标题
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
      title: '权限路径',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={'orange'} >{AuditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            <Button type='primary'>发布</Button>
          }
          {
            <Button type='primary'>撤销</Button>
          }
          {
            <Button type='primary'>修改</Button>
          }

        </div>
      }
    }
  ]

  const AuditList = ["", "审核中", "已通过", "未通过"]

  // 获取token中的信息
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    // _ne不等于，_lte小于等于
    //查找这个作者的auditState不等于0，草稿箱，publishState不能大于1，已上线，已下线
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
      .then(res => {
        setdataSource(res.data)
      })
  }, [])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        //数据中没有key时需要key值
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 5
        }}
      />
    </div>
  )
}
