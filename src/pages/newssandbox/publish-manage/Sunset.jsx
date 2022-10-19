import React from 'react'
import Newspublished from '../../../components/publish-manage/Newspublished'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'
export default function Sunset() {

    //publishState=3是已下线
    const{dataSource,handleDelete} = usePublish(3)

  
  return (
    <div>
      <Newspublished dataSource={dataSource} Button={ (id)=> <Button danger onClick={()=>handleDelete(id)} >删除</Button>} ></Newspublished>
    </div>
  )
}
