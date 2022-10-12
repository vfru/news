import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Modal, Popconfirm, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

export default function RightList() {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    axios.get("rights?_embed=children").then(
      res => {
        const list = res.data
        list.forEach(i => {
          if (i.children.length === 0) {
            i.children = ""
          }
        })
        setdataSource(list)
      })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='orange' >{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popconfirm title={
            <div>
              <div>配置项</div>
              <Switch checked={item.pagepermission} onChange={() => switchMethod(item)} />
            </div>
          }
            trigger={item.pagepermission === undefined ? '' : 'click'}
          >
            <Button type='primary' shape="circle" icon={<EditOutlined />}
              disabled={item.pagepermission === undefined}
            />
          </Popconfirm>

          <Button danger shape="circle" icon={<DeleteOutlined />}
            onClick={() => toConfirm(item)}
          />
        </div>
      }
    }
  ];
  const switchMethod = (item) => {
    item.pagepermission = item.pagepermission === 1 ? 0 : 1
    // console.log(item)
    setdataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`rights/${item.id}`, {
        pagepermission: item.pagepermission
      })
    } else {
      axios.patch(`children/${item.id}`, {
        pagepermission: item.pagepermission
      })
    }
  }
  const toConfirm = (item) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '你确认要删除？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        deleteMethod(item)
      }
    });
  }

  const deleteMethod = (item) => {
    // console.log(item)
    //当前页面同步状态 + 后端同步
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`rights/${item.id}`)
    } else {
      // console.log(item.rightId)

      let list = dataSource.filter(data => data.id === item.rightId)

      list[0].children = list[0].children.filter(data => data.id !== item.id)
      console.log(list, dataSource)
      setdataSource([...dataSource])
      axios.delete(`children/${item.id}`)
    }

  }


  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
      />
    </div>
  )
}
