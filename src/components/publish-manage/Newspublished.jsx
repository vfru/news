import React from 'react'
import {Table} from 'antd'
export default function Newspublished(props) {
    const dataSource = props.dataSource
    const columns = [
        {
          title: '新闻标题',
          dataIndex: 'label',
          render: (label, item) => {
            return <a href={`/news-manage/preview/${item.id}`} >{label}</a>
          }
        },
        {
          title: '作者',
          dataIndex: 'author',
        },
        {
          title: '新闻分类',
          dataIndex: 'category',
          render: (category) => {
            return <div>{category.label}</div>
          }
        },
        {
          title: '操作',
          render: (item) => {
            return <div>
              {props.Button(item.id)}
            </div>
          }
        },
      ]
    
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          //一页5个
          pageSize: 5
        }}
        //数据中没有key属性，需要key值，设置为id
        rowKey={item => item.id}
      />
    </div>
  )
}
