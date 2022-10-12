import React from 'react'
import {Button} from 'antd'
import axios from 'axios'

export default function Home() {
//json-server --watch .\db.json --port 8000
  const ajax = ()=>{
    //增 post
    // axios.post("http://localhost:8000/posts",
    // {
    //   "title": "333",
    //   "author": "KM"
    // })

    //更新 put
    // axios.put("http://localhost:8000/posts/1",
    // {
    //   "title": "111-修改",
    // })

    //更新 patch
    // axios.patch("http://localhost:8000/posts/1",{
    //   "title": "111-修改-1111",
    // })

    //删除
    // axios.delete("http://localhost:8000/posts/1")

    //_embed
    // axios.get("http://localhost:8000/posts?_embed=comments").then(res=>{
    //   console.log(res.data)
    // })

    //_expand
    axios.get("http://localhost:8000/comments?_expand=post").then(res=>{
      // console.log(res.data)
    })

  }

  return (
    <div>
      <Button onClick={ajax} >Button</Button>
    </div>
  )
}
