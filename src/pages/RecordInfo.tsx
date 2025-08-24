import React, { useEffect, useState } from "react"
import  {Layout, Tree,Card,Collapse,Divider,Form,Input} from 'antd'
import type { TreeDataNode,TreeProps} from "antd"
import { DownOutlined } from "@ant-design/icons"
import {allRecords} from './api/apis'
import { Outlet, useNavigate } from "react-router"
import { AxiosError } from "axios"
import {buildRecordToMap,convertMapToTreeNode,getFullDN} from './api/utils'
import {getDnInfo,getAllSchemas} from './api/apis'
import type {DNType} from '../types/index'

function RecordInfo () {
    const {Content, Sider} = Layout

    const [records, setRecords] = useState([])
    const [recordTree, setRecordTree] = useState<TreeDataNode[] | []>([])
    const [dnInfo, setDnInfo] = useState<DNType>()
    const [schema, setSchema] = useState({})
    const navigate = useNavigate()
    const getAllRecords = async () => {
        try {
            const res = await allRecords()
            const data = res.data
            //console.log("get data: ", data)
            setRecords(data)
            //console.log("records", records)
        }catch(err) {
            setRecords([])
            if (err instanceof AxiosError) {
                const status = err.response?.status
                const message = err.response?.data.message || err.message
                if (status === 401) {
                    console.log("unauthorizaed - redirect to loing")
                    navigate('/login')
                }else if (status === 403) {
                    console.log("forbidden -- insufficient permissions")
                }else if (status=== 500){
                    console.log(`internal error: ${status} -- ${message}`)
                }
                
            }else if (err instanceof Error) {
                console.log("error: ", err)
            }else  {
                console.log(err)
            }
        }
    }

    const retrieveSchemas = async() => {
        try {
            const schema = await getAllSchemas()
            //console.log(schema)
            setSchema(schema)
        }catch(error) {
            console.log("get schema error: ", error)
        }
    }

    useEffect(()=>{
        getAllRecords()
        setInterval(retrieveSchemas, 1000*60*30)
        retrieveSchemas()
    }, [])

    useEffect(()=>{
        if (records.length>0){
            const maps = buildRecordToMap(records)
            const data = convertMapToTreeNode(maps)
            //console.log("tree data: ", data)
            setRecordTree(data)
        }
    },[records])

    const onSelect:TreeProps['onSelect'] = async (selectKeys, info) => {
        const fulldn = getFullDN(recordTree, selectKeys[0].toString())
        //console.log("full dn: ", fulldn, ", keys: ", selectKeys, selectKeys[0].toString())

        try {
            const dnresp = await getDnInfo(fulldn)
            const data = dnresp.data[0]
            //console.log("dninfo: ", data)
            setDnInfo(data)
            //console.log("dn state:", dnInfo)
            navigate("display", {state: dnInfo})
        }catch (error) {
            console.log("dn info error:", error)
        }
    }

    const sideStyle:React.CSSProperties = {
        backgroundColor: '#c3c3c3'
    }

    const contentStyle:React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
    }


    return (

        <>
        <Layout>
            <Sider style={sideStyle}>
                <Tree
                    style={{width:'100vw', height: '100vh', marginTop: '50px', marginLeft:'8px'}}
                    showLine
                    switcherIcon={<DownOutlined/>}
                    onSelect={onSelect}
                    treeData={recordTree}
                    />
            </Sider>
            <Content style={contentStyle}>
                <Outlet/>
            </Content>
        </Layout>
        </>
    )
}


export {RecordInfo}
