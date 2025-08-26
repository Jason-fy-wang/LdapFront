import {Card, Form,Input,Button,Flex,message, Popconfirm } from 'antd'
import {useLocation, useNavigate } from 'react-router'
import type {DNType} from '../types/index'
import type { PopconfirmProps } from 'antd'
import {useEffect} from 'react'

function Display () {
    
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage()
    const [form] = Form.useForm()
    const location = useLocation()
    const dnInfo:DNType = location.state

    const updateFormValues = () => {
        form.resetFields()
        const initial : {[key:string]: any} = {}
        dnInfo?.Attributes.forEach(attr => {
            initial[attr.Name] = attr.Values
        })
        initial['DN'] = dnInfo?.DN

        //console.log('form initial value: ', initial)
        form.setFieldsValue(initial)
    }
    
    // when dn info change, then update the corresponding content info
    useEffect(() => {
        updateFormValues()
    }, [dnInfo])

    
    const jumpToAdd = () => {
        navigate("../add", {replace: true})
    }

    const confirm:PopconfirmProps['onConfirm'] = (e) => {
        console.log(e)
        messageApi.success("delete record")
    }

    const cancel:PopconfirmProps['onCancel'] = (e) => {
        console.log(e)
        messageApi.info("cancel delete")
    }

    return  (
        <>
        {contextHolder}
        <Card title="DN info" style={{width:"60%", height: "fit-content",marginTop:"1%"}}>
                    <Form
                    name="basic"
                    form={form}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: "80%"}}
                    autoComplete="off"
                    initialValues={dnInfo}
                    disabled
                    >
                        <Form.Item
                                label="DN"
                                name="DN"
                            >
                                <Input/>
                        </Form.Item>
                        {
                            dnInfo?.Attributes.map(attr => (
                                <Form.Item
                                label={(attr as any)["Name"]}
                                name={(attr as any)["Name"]}
                                key={(attr as any)["Name"]}
                            >
                                <Input/>
                            </Form.Item>
                            ))

                        }
                       
                    </Form>
                    <Flex style={{width:'100%'}} gap='small' justify='center'>
                        <Button type='primary' onClick={jumpToAdd}>Add</Button>
                        <Popconfirm 
                        title="delete the DN"
                        description="Are you sure to delete this record?"
                        okText="Yes"
                        cancelText="No"
                        onCancel={cancel}
                        onConfirm={confirm}
                        >
                        <Button type='primary' danger >Delete</Button>
                        </Popconfirm>
                    </Flex>
                </Card>        
        </>
    )
}


export {Display}
