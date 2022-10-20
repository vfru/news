import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Card, Col, Row, List } from 'antd';
import _ from 'lodash'
export default function News() {
    const [newsList, setnewsList] = useState([])
    useEffect(() => {
        axios.get(`news?publishState=2&_expand=category`).then(res => {
            setnewsList(res.data)
            console.log(Object.entries(_.groupBy(res.data,item=>item.category.label)))
            // Object.entries把key和内容组成一个对象
            setnewsList(Object.entries(_.groupBy(res.data, item => item.category.label)))

        })
    }, [])
    return (
        <div style={{
            width: '95%',
            margin: "0 auto"
        }} >
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            {/* gutter左右间距 */}
            <Row gutter={[16, 16]}>
                {
                    newsList.map(item =>
                        <Col span={8} key={item[0]} >
                            <Card title={item[0]} bordered={true}
                                // 鼠标放上去有阴影
                                hoverable={true}
                            >
                                <List
                                    size="small"
                                    // bordered
                                    // 每页3个
                                    pagination={{
                                        pageSize: 3
                                    }}
                                    dataSource={item[1]}
                                    // data是dataSource中的每一个元素
                                    renderItem={(data) => <List.Item><a href={`/detail/${data.id}`} >{data.label}</a></List.Item>}
                                />
                            </Card>
                        </Col>)
                }
            </Row>
        </div>
    )
}
