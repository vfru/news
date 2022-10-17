import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Modal,notification } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,VerticalAlignTopOutlined  } from '@ant-design/icons';
import axios from 'axios'
export default function NewsDraft() {
  //获取后端草稿箱数据，用table组件中的数据展示
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  useEffect(() => {
    axios.get(`news?author=${username}&auditState=0&_expand=category`).then(res => {
      console.log(res.data)
      const list = res.data
      setdataSource(list)
    })
  }, [username])

  //table组件的标题
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      //自定义样式
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'label',
      render:(label,item)=>{
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
        return category.label
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {/* 编辑 */}
          <Button  shape="circle" icon={<EditOutlined />}
            onClick={() => {
              navigate(`/news-manage/update/${item.id}`)
            }} />
            {/* 提交审核 */}
            <Button type='primary' shape="circle" icon={<VerticalAlignTopOutlined  />}
            onClick={() => toExamine(item.id)} />
            {/* 删除 */}
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmDelete(item)} />
          
        </div>
      }
    },
  ]
  //提交审核
  const toExamine=(id)=>{
    axios.patch(`news/${id}`,{
      auditState:1
    }).then(res=>{
      //跳转到审核页面
      navigate('/audit-manage/list')
       //右下角弹出提醒
       notification.info({
        message: `通知`,
        description: `你可以到审核列表中查看`,
        placement: 'bottomRight',
      });
    })
  }
  //点击删除后，弹出确认框
  const confirmDelete = (item) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '你确认要删除？',
      cancelText: '取消',
      okText: '确认',
      //点击ok后
      onOk() {
        deleteMethod(item)
      }
    });
  }
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }



  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}
        pagination={{
          pageSize: 5
        }}

      ></Table>


    </div>
  )
}
