import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
export default function AuditList() {
  const navigate = useNavigate()
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
        const AuditList = ["", "审核中", "已通过", "未通过"]
        const colorList = ["", "orange", "green", "red"]
        return <Tag color={colorList[auditState]} >{AuditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={() => handleRervert(item)} >撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => handlePublish(item)} >发布</Button>
          }
          {
            item.auditState === 3 && <Button type='primary' onClick={() => handleUpdate(item)} >更新</Button>
          }

        </div>
      }
    }
  ]
  //点击撤销
  const handleRervert = (item) => {
    //过滤出没选中的id
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `你可以到草稿中查看`,
        placement: 'bottomRight',
      });
    })
  }
  //点击更新
  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }
  //点击发布
  const handlePublish = (item) => {
    axios.patch(`news/${item.id}`, {
      //已发布
      publishState: 2,
      publishTime:Date.now()
    }).then(res => {
      navigate("/publish-manage/published")
      notification.info({
        message: `通知`,
        description: `你可以到发布管理中/已发布查看`,
        placement: 'bottomRight',
      });
    })
  }



  // 获取token中的信息
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    // _ne不等于，_lte小于等于
    //查找这个作者的auditState不等于0，草稿箱，publishState不能大于1，已上线，已下线
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
      .then(res => {
        setdataSource(res.data)
      })
  }, [username])
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
