import React from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
//用useNavigate跳转到login页面
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
const { Header } = Layout;
function TopHeader(props) {
  const changeCollapsed = () => {
    //改变state的isCollapsed
    // console.log(props)
    props.changeCollapsed()
  }
  const navigate = useNavigate()
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu
      items={[
        {
          key: "1",
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
        // 小图标的变化
        props.isCollapsed ? <MenuFoldOutlined onClick={changeCollapsed} /> : <MenuUnfoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: "right" }} >
        <span>欢迎<span style={{ color: "#1890ff" }} >{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
/*
connect(
  //mapStateToprops
  //mapDispatchToprops
)(包装的组件)
*/
//解构出CollapsedReducer中的isCollapsed
const mapStateToprops = ({ CollapsedReducer: { isCollapsed } }) => {
  //state中有redux中
  // console.log(isCollapsed)
  return {
    isCollapsed
  }
}
const mapDispatchToprops = {
  changeCollapsed() {
    return {
      type: "changeCollapsed",
      //playload:
    }
  }
}

export default connect(
  mapStateToprops,
  mapDispatchToprops
)(TopHeader)