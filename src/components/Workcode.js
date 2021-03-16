import { useState, useEffect } from "react"
import {Modal, Select} from "antd";

const Workcode = props => {

    const { data, callHangup, setCallHangup, channelId, submitWorkcode } = props

    const [workcode, setWorkcode] = useState('')

    return(
        <Modal
            title="Assign workcode"
            visible={callHangup && channelId}
            onOk={() => submitWorkcode(workcode)}
            onCancel={() => setCallHangup(false)}
            okText="Submit"
            maskClosable={false}
            closable={false}
        >
            <Select placeholder="Select workcode" onChange={value => setWorkcode(value)} style={{ width: '100%' }} size="large">
                {data && data.map((value, index) => <Select.Option key={value.id} value={value.name}>{value.name}</Select.Option>)}
            </Select>
        </Modal>
    )
}

export default Workcode