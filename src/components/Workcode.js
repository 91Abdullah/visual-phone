import { useState, useEffect } from "react"
import {Modal, Select} from "antd";

const Workcode = props => {

    const { data, callHangup, setCallHangup } = props

    return(
        <Modal
            title="Assign workcode"
            visible={false}
            onOk={() => console.log('ok')}
            onCancel={() => setCallHangup(false)}
            okText="Submit"
            maskClosable={false}
            closable={false}
        >
            <Select placeholder="Select workcode" onChange={value => console.log(value)} style={{ width: '100%' }} size="large">
                {data && data.map((value, index) => <Select.Option key={value.id} value={value.name}>{value.name}</Select.Option>)}
            </Select>
        </Modal>
    )
}

export default Workcode