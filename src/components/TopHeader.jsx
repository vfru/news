import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
//用useNavigate跳转到login页面
import { useNavigate } from 'react-router-dom'
const { Header } = Layout;
export default function TopHeader() {
  const [collapsed, setcollapsed] = useState(false)
  const changeCollapsed = () => { setcollapsed(!collapsed) }
  const navigate = useNavigate()
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token")) 

  const menu = (
    <Menu
      items={[
        {
          key:"1",
          label: roleName,
        },
        {
          key: '2',
          danger: true,
          label: '退出',
          onClick: () => {
            localStorage.removeItem('token')
            navigate('/login')
          }
        },
      ]}
    />
  );


  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {
        collapsed ? <MenuFoldOutlined onClick={changeCollapsed} /> : <MenuUnfoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: "right" }} >
        <span>欢迎<span style={{color:"#1890ff"}} >{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
