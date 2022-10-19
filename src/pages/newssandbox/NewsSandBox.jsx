import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout,  Spin } from 'antd';
// import {  Progress } from 'antd';
// import  {useState} from 'react'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import './NewsSandBox.css'
import { connect } from 'react-redux'
const { Content } = Layout;



 function NewsSandBox(props) {
  // const [percent, setPercent] = useState(0);

  useEffect(() => {
    // setPercent(100)
  }, [])
  return (
    <Layout>

      <SideMenu></SideMenu>

      <Layout className="site-layout" >
        {/* <Progress percent={percent} /> */}
        <TopHeader></TopHeader>
        {/* Spin显示页面的加载中，通过redux控制 */}
        <Spin size='large' spinning={props.isLoading} >
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
        </Spin>
      </Layout>
    </Layout>
  )
}
const mapStateToprops = ({ LoadingReducer: { isLoading } }) => {
  //state中有redux中
  return {
    isLoading
  }
}
export default connect(
  mapStateToprops
)(NewsSandBox)