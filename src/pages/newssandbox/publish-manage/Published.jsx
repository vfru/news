import React from 'react'
import Newspublished from '../../../components/publish-manage/Newspublished'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'
export default function Published() {

  //publishState=2是已发布
  const{dataSource,handleSunset} = usePublish(2)
  
  return (
    <div>
      <Newspublished dataSource={dataSource}  Button={(id)=><Button onClick={()=>handleSunset(id)} >下线</Button>} ></Newspublished>
    </div>
  )
}
