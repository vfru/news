import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd';
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'

import './NewsSandBox.css'

const { Content } = Layout;



export default function NewsSandBox() {

  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout" >

          <TopHeader></TopHeader>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              overflow: 'auto'//超过内容区自动撑开
            }}
          >
            <Outlet />
          </Content>
      </Layout>
    </Layout>
  )
}
