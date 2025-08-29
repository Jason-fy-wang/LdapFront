import { Card,Form,Input,Button, Select,Collapse, type CollapseProps, Row, Col } from "antd"
import { useState, useEffect,useRef } from "react"
import {getAllSchemas} from '../pages/api/apis'
import { getStructuralKey,getAuxiliary,getObjectAttributes } from "../pages/api/utils.tsx"
import type { Schema } from "../types/index.ts"
import {PlusOutlined} from '@ant-design/icons'

function Ladd() {
    const [form] = Form.useForm()
    const {Option} = Select;

    const [dnInfo, setDnInfo] = useState()
    const [schema, setSchema] = useState({schemas: {}})
    const [struct, setStruct] = useState<string[]>()
    const [auxiliaryKey, setAuxiliaryKey] = useState<string[]>([])

    const [selectedStructural, setSelectedStructural] = useState<string>('')
    //const [selectedAuxiliary, setSelectedAuxiliary] = useState<string[]>([])
    
    const selectedAuxiliary = useRef(new Map<string,string>())
    const [structuralAttribute, setStructuralAttribute] = useState<[string[],string[]]>([[],[]]);
    const [auxiliaryAttributes, setAuxiliaryAttributes] = useState<Record<string,Schema>>({})

    const [showAuxiliarySelect, setShowAuxiliarySelect] = useState(false)
    const [auxCount, setAuxCount] = useState(1)
    
    const [,forceRender] = useState({})

    const triggerRender = ()=>{
        forceRender({})
    }

    const retrieveSchemas = async() => {
        try {
            const s = await getAllSchemas()
            //console.log("getted data: " , s)
            setSchema({schemas: s.data.schemas})
        }catch(error) {
            console.log("get schema error: ", error)
        }
    }

    // update corresponding key base on schems
    useEffect( () => {
            const tmp = getStructuralKey(schema)
            setStruct(tmp)
            //console.log("struct: ", struct)
            const tm = getAuxiliary(schema)
            setAuxiliaryKey(tm)
            //console.log("auxiliary key: ", auxiliaryKey)
    }, [schema])
    
    useEffect(()=>{
        //setInterval(retrieveSchemas, 1000*60)
        retrieveSchemas()
    }, [])

    useEffect(() => {
        if (schema.schemas !== null || schema.schemas?.top === undefined)
            //console.log("loading data1")
            retrieveSchemas()
    }, [location.pathname])

    const onStructObjSelect = (value: string ) => {
        //console.log("struct select val: ", value)
        const attrs = getObjectAttributes(schema, value)
        setSelectedStructural(value)
        setStructuralAttribute([attrs.must||[], attrs.may||[]])

        setShowAuxiliarySelect(true)
        triggerRender()
    }

    const onAuxiliarySelect = (key:string, value: string) => {
        //console.log("select auxiliary key :",key, ", value is: ", value)
        selectedAuxiliary.current.set(key, value)
        
        triggerRender()
    }

    const showAuxiliarySelectItem = ()=>{
        if (!showAuxiliarySelect) {
            return (<></>)
        }
        
        const vals = Array.from(selectedAuxiliary.current.keys()).map((key,idx) => (
            <>
            <Form.Item
                label="ObjectClass(Auxiliary)"
                name={key}
            >
                <Select
                placeholder="select objectClass for record"
                onSelect={(value) => {onAuxiliarySelect(key, value)}}
                value={selectedAuxiliary.current.get(key)}
                >
                {
                    auxiliaryKey?.map((str, index) => (
                    <Option key={index} value={str}>{str}</Option>
                    ))
                }
                </Select>
            </Form.Item>
            <Row>
                <Col span={16} offset={8}>
                    <Collapse items={selectedAuxiliary.current.get(key) !== "" ? renderAttributeInputs(selectedAuxiliary.current.get(key)) : undefined} 
                    style={{width:"100%",marginTop: "2px"}}></Collapse>
                </Col>
            </Row>
            </>
        ))
        
        return vals
    }

    const addAuxiliarySelect = () => {
        const idx = `ObjectClass${auxCount}`
        selectedAuxiliary.current.set(idx,"")
        setAuxCount(auxCount+1)
        triggerRender()
    }

    const renderAttributeInputs = (objclass: string|undefined) => {
        if (objclass === "" || objclass === undefined) {
            return
        }
        let attrs: string[] = getObjectAttributes(schema, objclass).must || []
        const child = attrs.map((attr, idx) => (
            <Form.Item
                key={idx}
                label={attr}
                name={attr}
                style={{marginBottom: 12}}
                >
                    <Input placeholder={`enter ${attr}`} />
                </Form.Item>
        ));

        let mayattrs: string[] = getObjectAttributes(schema, objclass).may || []
        const maychild = mayattrs.map((attr, idx) => (
            <Form.Item
                key={idx}
                label={attr}
                name={attr}
                style={{marginBottom: 12}}
                >
                    <Input placeholder={`enter ${attr}`} />
                </Form.Item>
        ));

        const items: CollapseProps["items"] = [
            {
                key: "1",
                label: "Must",
                children: <>{child}</>

            },
            {
                key: "2",
                label: "May",
                children: <>{maychild}</>
            }
        ]

        return items
    }

    return (
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
                    >
                    <div style={{width: "100%"}}>
                        <Form.Item
                                label="DN"
                                name="DN"
                            >
                                <Input/>
                        </Form.Item>
                        <Form.Item
                                label="ObjectClass(structural)"
                                name="objectClass"
                            >
                                <Select
                                placeholder="select objectClass for record"
                                onSelect={onStructObjSelect}
                                >
                                {
                                  struct?.map((str, index) => (
                                    <Option key={index} value={str}>{str}</Option>
                                  ))
                                }
                                </Select>
                        </Form.Item>
                        {
                        <Row>
                            <Col span={16} offset={8}>
                                <Collapse items={renderAttributeInputs(selectedStructural)} 
                                style={{width:"100%",marginTop: "2px"}}></Collapse>
                            </Col>
                        </Row>
                        }
                        {
                         showAuxiliarySelectItem()
                        }
                        <Row>
                            <Col span={16} offset={8}>
                                <Button onClick={addAuxiliarySelect} style={{width:"100%",marginTop:"16px"}} icon={<PlusOutlined />}/>
                            </Col>
                            </Row>
                       <Form.Item label={null} style={{marginTop: "16px"}}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                        </div>
                    </Form>
            </Card>  
        </>
    )
}


export {Ladd}
