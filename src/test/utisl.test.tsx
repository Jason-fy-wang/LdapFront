import { describe, expect, it } from "vitest";
import {buildRecordToMap,convertMapToTreeNode,getFullDN} from '../pages/api/utils'

describe('utils test', ()=>{
    const dns = [{
            DN: "dc=example,dc=com",
        },{
            DN: "ou=person,dc=example,dc=com",
        },{
            DN: "cn=john, ou=person, dc=example,dc=com"
        },
        {
            DN: "ou=HR,dc=example,dc=com"
        }
        ]

    it('test record to map', ()=> {
        const data = buildRecordToMap(dns)
        //printData(data)
        expect(data.get("dc=com")["children"]).exist
        expect(data.get("dc=com")["children"].size).toEqual(1)
        expect(data.get("dc=com")["children"].get("dc=example")).exist
        expect(data.get("dc=com")["children"].get("dc=example").key).toEqual("dc=example")
        expect(data.get("dc=com")["children"].get("dc=example").children.get("ou=person").key).toEqual("ou=person")
        
    })


    it("test map to tree", ()=>{
        const data = buildRecordToMap(dns)
        const tree = convertMapToTreeNode(data)
        console.log(JSON.stringify(tree))
        expect(tree[0].title).toEqual("dc=com")
        expect(tree[0].isLeaf).false
        expect(tree[0].key).toEqual("dc=com")
        expect(tree[0]!.children).exist

        expect(tree[0]!.children![0]!.title).exist
        expect(tree[0]!.children![0]!.key).exist
        expect(tree[0]!.children[0]!.children).exist
        expect(tree[0]!.children[0]!.children[0].key).exist

    })
    
    it("test full dn build", () => {
        const data = buildRecordToMap(dns)
        const tree = convertMapToTreeNode(data)
        printData(tree)
        const dn = getFullDN(tree, "ou=person")
        expect(dn).toEqual("ou=person,dc=example,dc=com")
        const dn2 = getFullDN(tree, "cn=john")
        expect(dn2).toEqual("cn=john,ou=person,dc=example,dc=com")
        const dn3 = getFullDN(tree, "ou=HR")
        console.log("dn3 : ", dn3)
    })

})

function printData(data:Map<string,any>) {
    for(const entry of data.entries()) {
            console.log(entry)
            if(entry[1]["children"]) {
                printData(entry[1]["children"])
            }
        }
}
