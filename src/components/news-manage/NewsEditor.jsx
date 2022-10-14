import React, { useState, useEffect } from 'react'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
export default function NewsEditor(props) {
    //存储 editor 实例
    const [editor, setEditor] = useState(null)
    // 编辑器内容
    const [html, setHtml] = useState('')
     // 工具栏配置
     const toolbarConfig = { }  
    // 编辑器配置
    const editorConfig = {
        placeholder: '请输入内容...',
    }
    // editorConfig.onBlur = () => {            
    //     console.log(html)
    // }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])
    return (
        <div>
            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                {/* 工具栏 */}
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                {/* 编辑器 */}
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
            {/* 底下显示富文本 */}
            <div >
                {/* {html} */}
                { 
                    props.getContent(html)
                }
            </div>
        </div>
    )
}
