import {Modal, Select} from "antd";
import { useState } from "react"

const NotReady = props => {

    return(
        <Modal
            title="Specify Reason"
            centered={true}
            keyboard={false}
            maskClosable={false}
            okText="Submit"
            visible={props.visible}
            onOk={props.onOk}
            onCancel={props.onCancel}
        >
            <Select placeholder="Select Reason" onChange={value => props.setNotReadyReason(value)} style={{ width: '100%' }} size="large">
                {props.data && props.data.map((value, index) => <Select.Option key={value.id} value={value.name}>{value.name}</Select.Option>)}
            </Select>
        </Modal>
    )
}

export default NotReady