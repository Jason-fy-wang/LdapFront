import { Card,Form,Input,Button, Select,Collapse } from "antd"
import { useState, useEffect } from "react"
import {getAllSchemas} from '../pages/api/apis'
import type {Schema,SchemaData} from "../types/index.ts"
import { getStructuralKey,getAuxiliary,getObjectAttributes } from "../pages/api/utils.tsx"


function Ladd() {
    const [form] = Form.useForm()
    const {Option} = Select;

    const [dnInfo, setDnInfo] = useState()
    const [schema, setSchema] = useState({schemas: {}})
    const [struct, setStruct] = useState<string[]>()
    const [auxiliaryKey, setAuxiliaryKey] = useState<string[]>([])

    const [selectedStructural, setSelectedStructural] = useState<string>('')
    const [selectedAuxiliary, setSelectedAuxiliary] = useState<string[]>([])
    const [structuralAttribute, setStructuralAttribute] = useState<[string[],string[]]>({});
    const [auxiliaryAttributes, setAuxiliaryAttributes] = useState<Record<string,string[]>>({})

    const [showAuxiliarySelect, setShowAuxiliarySelect] = useState(false)
    const [showAttributeCollapse, setShowAttributeCollapse] = useState(false)

    
    const retrieveSchemas = async() => {
        try {
            const s = await getAllSchemas()
            //console.log(schema)
            setSchema({schemas: s.data.schemas})
            const tmp = getStructuralKey(schema)
            setStruct(tmp)
            const tm = getAuxiliary(schema)
            setAuxiliaryKey(tm)
        }catch(error) {
            console.log("get schema error: ", error)
        }
    }

    
    useEffect(()=>{
        setInterval(retrieveSchemas, 1000*60*30)
        retrieveSchemas()
    }, [])

    const onStructObjSelect = (value: string ) => {
        console.log(value)
        const attrs = getObjectAttributes(schema, value)
        setSelectedStructural(value)
        setStructuralAttribute([attrs.must||[], attrs.may||[]])

        setShowAuxiliarySelect(true)
        setShowAttributeCollapse(true)

        setSelectedAuxiliary([])
        setAuxiliaryAttributes({})
    }

    const onAuxIliarySelect = (value: string[]) => {
        console.log("select auxiliary", value)
        setSelectedAuxiliary(value)

        const auxAttrs: Record<string,string[]> = {}

        value.forEach(val => {
            const attr = getObjectAttributes(schema, val)
            if (attr){
                auxAttrs[val] =  attr
            }
        })

        setAuxiliaryAttributes(auxAttrs)
    }


    const renderAttributeInputs = (attrs: string[]) => {
        return attrs.map((attr, idx) => (
            <Form.Item
                key={`${attr}`}
                label={attr}
                name={attr}
                style={{marginBottom: 12}}
                >
                    <Input placeholder={`enter ${attr}`} />
                </Form.Item>
        ));
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
                            <Collapse ></Collapse>

                        }
                       <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
            </Card>  
        </>
    )
}


export {Ladd}
