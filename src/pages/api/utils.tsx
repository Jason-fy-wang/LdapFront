import type { TreeDataNode } from "antd"
import type {RecordArray, NodeData} from '../../types/index'


const buildRecordToMap = (recordsArray: Array<RecordArray>) => {
    const treedata:Map<string,any> = new Map()
    let current = treedata
    for(const record of recordsArray){
        record.DN.split(",").reverse().forEach((item:string) => {
            item = item.trim()
            if(!current.has(item)) {
                current.set(item,
                    {
                        title: item,
                        key: item,
                        children: new Map<string,any>()
                    }
                )
            }
            current = current.get(item).children
        })
        current = treedata
    }

    return treedata
}

const convertMapToTreeNode = (data: Map<string,any>) => {
    const tree:TreeDataNode[]=[]

    for(const entry of data.entries()) {
        const obj: TreeDataNode = {
            title: entry[1].title,
            key: entry[1].key,
            isLeaf: false
        }
        if (entry[1].children) {
            obj.isLeaf = false
            obj.children = convertMapToTreeNode(entry[1].children)
        }
        tree.push(obj)
    }

    return tree
}


const getFullDN = (data:TreeDataNode[], dn: string) :string => {
    let path: string[] 

    function search (curdata: TreeDataNode[], result: string[]) {
         for (const node of curdata) {
            const newpath: string[] = [...result, node.key.toString()]
            if (node.key === dn) {
                return newpath
            }
            
            if (node.children && node.children.length > 0){
                const foundPath:string[] = search(node.children, newpath)
                if (foundPath && foundPath.length>0) {
                    return foundPath
                }
            }
        }
        return []
    }

   path = search(data, [])
   return path.reverse().join(",")
}


export {buildRecordToMap,convertMapToTreeNode,getFullDN}
