import {Card, Form,Input} from 'antd'
import { useLocation } from 'react-router'
import type {DNType} from '../types/index'
import {useEffect} from 'react'

function Display () {
    
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



    return  (
        <>
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
                                <Input value={dnInfo?.DN} />
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
                </Card>        
        </>
    )
}


export {Display}
