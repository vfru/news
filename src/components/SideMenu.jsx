import React, { useEffect, useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.css'
import axios from 'axios'
const { Sider } = Layout;

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  "/news-manage": <UserOutlined />,
  "/news-manage/add": <UserOutlined />,
  "/news-manage/draft": <UserOutlined />,
  "/news-manage/category": <UserOutlined />,
  "/audit-manage": <UserOutlined />,
  "/audit-manage/audit": <UserOutlined />,
  "/audit-manage/list": <UserOutlined />,
  "/publish-manage": <UserOutlined />,
  "/publish-manage/unpublished": <UserOutlined />,
  "/publish-manage/published": <UserOutlined />,
  "/publish-manage/sunset": <UserOutlined />,
}


 function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("rights?_embed=children").then(res => {
      // console.log(res.data)
      setMenu(res.data)
    })
  }, [])

  const navigate = useNavigate()
  const { role: { rights: { checked } } } = JSON.parse(localStorage.getItem("token"))
  //筛选pagepermission等于显示页面，有子组件的要用下拉菜单
  const check = (list) => {
    // const list = menu.pagepermission&&checked.includes(menu.key)

    return list.map(item => {
      // 要有children属性且大于1，而且要权限中包括的页面
      if (item.children && item.pagepermission && item.children.length > 0 && checked.includes(item.key)) {
        return {
          key: item.key,
          icon: iconList[item.key],
          label: item.label,
          children: item.children.map(item => {
            if (item.pagepermission && checked.includes(item.key)) {
              return {
                key: item.key,
                label: item.label,
                icon: iconList[item.key],
              }
            }
            return null
          })
        }
      }  
      //首页，或者其他的被权限禁用时
      if (checked.includes(item.key)&& item.pagepermission) {
        return {
          key: item.key,
          label: item.label,
          icon: iconList[item.key],
        }
      }
      else {
        return null
      }
      
    })
  }

  //刷新页面任停留在当前位置
  const location = useLocation()
  const nowlocation = [location.pathname]
  const openkey = ["/" + location.pathname.split("/")[1]]

  const renderMenu = (menuList) => {
    return <Menu theme="dark"
      mode="inline"

      selectedKeys={nowlocation}
      defaultOpenKeys={openkey}
      items={menuList}
      onClick={(list) => navigate(list.key)}
    />
  }

  return (
    // collapsed是否折叠,通过rudux中的isCollapsed控制
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }} >
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{ flex: 1, "overflow": "auto" }} >
          {renderMenu(check(menu))}
        </div>
      </div>


    </Sider>
  )
}
//解构出CollapsedReducer中的isCollapsed
const mapStateToprops = ({ CollapsedReducer: { isCollapsed } }) => {
  //state中有redux中
  return {
    isCollapsed
  }
}

export default connect(
  mapStateToprops,
)(SideMenu)