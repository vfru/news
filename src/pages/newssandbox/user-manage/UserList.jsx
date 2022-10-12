import React, { useEffect, useState, useRef } from 'react'
import { Switch, Table, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm';

export default function UserList() {
  //表格的数据
  const [dataSource, setdataSource] = useState([])
  //保存区域数据
  const [regionList, setregionList] = useState([])
  //保存角色数据
  const [roleList, setroleList] = useState([])
  //控制创建用户的表单打开
  const [isOpen, setIsOpen] = useState(false)
  //存储要新增用户时选择的数据
  const addForm = useRef(null)
  //存储要修改用户的数据
  const updateForm = useRef(null)
  //控制修改用户的表单开关
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  //控制修改用户表单的区域选项是否禁用
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  //保存要修改的用户的id
  const [updateUserId, setupdateUserId] = useState(null)
  //token中获得用户的权限和区域，控制用户页面的显示
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  
  useEffect(() => {
    const roleObj = {
      "1": "超级管理员",
      "2": "区域管理员",
      "3": "区域编辑",
    }
    //现有的用户数据
    axios.get("http://localhost:8000/users?_expand=role").then(res => {
      const list = res.data
      setdataSource(roleObj[roleId] === "超级管理员" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region &&roleObj[item.roleId]==="区域编辑"),
      ])
    })
    //区域数据
    axios.get("http://localhost:8000/regions").then(res => {
      const list = res.data
      setregionList(list)
    })
    //角色数据
    axios.get("http://localhost:8000/roles").then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [roleId, region, username])
  //表格的标题，框架
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.label,
          value: item.value,
        })), {
          text: '全球',
          value: '全球',
        }
      ],
      onFilter: (value, item) => {
        // console.log(value,item)
        //item是用户数据，用户数据中的region等于value的值筛选出来
        if (value === "全球") {
          return item.region === ''
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      // render自定义格式
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      // render自定义格式
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape="circle" icon={<EditOutlined />}
            disabled={item.default}
            onClick={() => toUpdate(item)}
          />
          <Button danger shape="circle" icon={<DeleteOutlined />}
            disabled={item.default}
            onClick={() => toConfirm(item)}
          />
        </div>
      }
    }
  ]
  //修改用户数据,将所选中的用户数据保存在ref
  // const toUpdate = async (item) => {
  //   await setIsUpdateOpen(true)
  //   await updateForm.current.setFieldsValue(item)
  // }
  const toUpdate = (item) => {
    setIsUpdateOpen(true)
    setTimeout(() => {
      if (item.roleId === 1) {
        //超级管理员禁用区域
        setIsUpdateDisabled(true)
      } else {
        //取消禁用
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)
    //保存id，通过id发送后端修改数据
    setupdateUserId(item)
  }
  //删除前确认
  const toConfirm = (item) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '你确认要删除？',
      cancelText: '取消',
      okText: '确认',
      //点击确认
      onOk() {
        deleteMethod(item)
      }
    });
  }
  const deleteMethod = (item) => {
    axios.delete(`http://localhost:8000/users/${item.id}`)
    setdataSource(dataSource.filter(data => data.id !== item.id))
  }

  //点击修改用户状态
  const handleChange = (item) => {
    // console.log(item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    //发送后端修改数据
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  //添加用户点击确认后
  const addFormOk = () => {
    // console.log("add",addForm)
    addForm.current.validateFields().then(value => {
      //关闭弹出框
      setIsOpen(false)
      //点击后清除输入框的内容
      addForm.current.resetFields()
      //先post到后端，生成id，再设置dataSource，方便后面的删除和更新
      axios.post(`http://localhost:8000/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res.data)
        //重新请求数据
        axios.get("http://localhost:8000/users?_expand=role").then(res => {
          const list = res.data
          setdataSource(list)
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }

  //
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      // console.log(value)
      //关闭弹出框
      setIsUpdateOpen(false)
      //点击后清除输入框的内容
      updateForm.current.resetFields()

      axios.patch(`http://localhost:8000/users/${updateUserId.id}`, value).then(res => {
        console.log(res.data)
        //重新请求数据
        axios.get("http://localhost:8000/users?_expand=role").then(res => {
          const list = res.data
          setdataSource(list)
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div>
      <Button type="primary" onClick={
        () => {
          setIsOpen(true)

        }
      } >添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          //一页5个
          pageSize: 5
        }}
        //数据中没有key属性，需要key值，设置为id
        rowKey={item => item.id}
      />
      {/* 添加用户组件 */}
      <Modal
        open={isOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsOpen(false)
          //点击后清除输入框的内容
          addForm.current.resetFields()
        }}
        onOk={addFormOk}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
      </Modal>

      {/* 修改用户组件 */}
      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateOpen(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={updateFormOk}
      >
        <UserForm isUpdate={true} regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} />
      </Modal>
    </div>
  )
}
