import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Progress } from 'antd';
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import './NewsSandBox.css'
const { Content } = Layout;



export default function NewsSandBox() {
  const [percent, setPercent] = useState(0);
  
  useEffect(() => {
    setPercent(100)
  }, [])
  return (
    <Layout>

      <SideMenu></SideMenu>

      <Layout className="site-layout" >
        <Progress percent={percent} />
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
