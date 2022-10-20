import * as echarts from 'echarts';
import _ from 'lodash'
import React, { useEffect, useState, useRef } from 'react'
// import {Button} from 'antd'
import axios from 'axios'
import { Card, Col, Row, List, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
const { Meta } = Card;


export default function Home() {
  //json-server --watch .\db.json --port 8000
  // const ajax = ()=>{
  //   //增 post
  //   // axios.post("http://localhost:8000/posts",
  //   // {
  //   //   "title": "333",
  //   //   "author": "KM"
  //   // })

  //   //更新 put
  //   // axios.put("http://localhost:8000/posts/1",
  //   // {
  //   //   "title": "111-修改",
  //   // })

  //   //更新 patch
  //   // axios.patch("http://localhost:8000/posts/1",{
  //   //   "title": "111-修改-1111",
  //   // })

  //   //删除
  //   // axios.delete("http://localhost:8000/posts/1")

  //   //_embed
  //   // axios.get("http://localhost:8000/posts?_embed=comments").then(res=>{
  //   //   console.log(res.data)
  //   // })

  //   //_expand
  //   axios.get("comments?_expand=post").then(res=>{
  //     // console.log(res.data)
  //   })

  // }
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const barRef = useRef()
  useEffect(() => {
    //_sort按少到多正顺序排序，_order=desc反序，_limit=6限制为6个
    axios.get(`news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      setviewList(res.data)
    })
    axios.get(`news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      setstarList(res.data)
    })
  }, [])
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  //图表的数据请求
  useEffect(() => {

    axios.get('news?publishState=2&_expand=category').then(res => {
      // console.log(res.data)
      // _.groupBy分类
      renderBarView(_.groupBy(res.data, item => item.category.label))
    })
  }, [])
  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj)
      },
      yAxis: {},
      series: [
        {
          name: '数量',
          type: 'bar',
          // 映射长度
          data: Object.values(obj).map(item=>item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  return (
    <div>
      {/* <Button onClick={ajax} >Button</Button> */}
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                size="small"
                // 头
                // header={<div>Header</div>}
                // 尾
                // footer={<div>Footer</div>}
                // bordered
                dataSource={viewList}
                renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.label}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                size="small"
                dataSource={starList}
                renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`} >{item.label}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region === "" ? "全球" : region}</b>
                    <span style={{ paddingLeft: '30px' }} >{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
        {/* 高度400，离上方30，宽度100% */}
        <div ref={barRef} style={{ height: "400px", marginTopL: "30px", width: '100%' }}></div>
      </div>
    </div>
  )
}
