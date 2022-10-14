import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
export default function NewsDraft() {
  //获取后端roles的数据，用table组件中的数据展示
  const [dataSource, setdataSource] = useState([])
  //获取后端rights的数据，用于roles的权限修改
  const [rightList, setrightList] = useState([])
  //获取当前的角色中rights的值，用于树状图的打勾表示
  const [currentRights, setcurrentRights] = useState([])
  //用于保存树状图修改的roles的id，用来匹配后端数据，后修改数据
  const [currentId, setcurrentId] = useState(0)
  //isOpen是否能设置树状图
  const [isOpen, setisOpen] = useState(false)
  useEffect(() => {
    axios.get("roles").then(res => {
      setdataSource(res.data)
    })

    axios.get(`news?author=admin&auditState=0`).then(res => {
      // console.log(res.data)
      //树状图需要title对象在后端的label上
      const list = res.data
      setrightList(list)
    })
  }, [])
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape="circle" icon={<UnorderedListOutlined />}
            onClick={() => {
              //点击后展示树状图
              setisOpen(true)
              //获取当前的角色中rights的值
              setcurrentRights(item.rights)
              setcurrentId(item.id)
            }} />

          <Button danger shape="circle" icon={<DeleteOutlined />}
            onClick={() => confirmDelete(item)} />
        </div>
      }
    },
  ]
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
    axios.delete(`roles/${item.id}`)
  }

  //点击ok后，放送后端同步数据
  const handleOk = () => {
    console.log(currentRights.checked)
    //点击ok后关闭树状图
    setisOpen(false)
    //同步dataSource数据
    setdataSource(dataSource.map(i => {
      //通过之前保存的id找到要修改的角色
      if (i.id === currentId) {
        return {
          ...i,
          rights: currentRights
        }
      }
      return i
    }))
    axios.patch(`roles/${currentId}`,
      {
        rights: currentRights
      }
    )
  }
  //点击关闭时
  const handleCancel = () => {
    setisOpen(false)
  }

  //点击更改树状表权限开关
  const onCheck = (checkKeys) => {
    // console.log(checkKeys)
    //获取你点击修改后，当前的角色中rights的值
    setcurrentRights(checkKeys)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} ></Table>

      <Modal title="权限分配" open={isOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          //通过后端数据展示树状图
          treeData={rightList}
          //通过角色的rights值，与right的key值对比，判断权限开关（打勾）
          checkedKeys={currentRights}
          //点击权限开关后
          onCheck={onCheck}
          //父子节点选中状态不再关联
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
