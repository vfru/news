import React from 'react'
import Newspublished from '../../../components/publish-manage/Newspublished'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'
export default function Unpublished() {

  //publishState=1是待发布
  const { dataSource, handlePublish } = usePublish(1)


  return (
    <div>
      <Newspublished dataSource={dataSource} Button={(id) => <Button type='primary' onClick={() => handlePublish(id)}  >发布</Button>} ></Newspublished>
    </div>
  )
}
