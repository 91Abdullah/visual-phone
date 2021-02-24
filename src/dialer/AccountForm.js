import {Form, Input, Button, Checkbox, Switch} from 'antd'
import  { useEffect } from "react"
import { useStorageState } from 'react-storage-hooks'

const AccountForm = props => {

    const [form] = Form.useForm()

    const onFinish = (values) => {
        console.log(values)
    }

    return (
        <Form form={form} name="nest-messages" onFinish={onFinish} initialValues={{ queueStats: props.queueStats, agentStats: props.agentStats, enableCdr: props.cdrStats, enableAa: props.aaStats }}>
            <Form.Item name="queueStats" label="Enable Q-Stats" valuePropName="checked">
                <Switch onChange={() => props.setQueueStats(!props.queueStats)} />
            </Form.Item>
            <Form.Item name="agentStats" label="Enable Agent-Stats" valuePropName="checked">
                <Switch onChange={() => props.setAgentStats(!props.agentStats)} />
            </Form.Item>
            <Form.Item name="enableCdr" label="Enable CDRs" valuePropName="checked">
                <Switch onChange={() => props.setCdrStats(!props.cdrStats)} />
            </Form.Item>
            <Form.Item name="enableAa" label="Enable Auto-answer" valuePropName="checked">
                <Switch onChange={() => props.setAaStats(!props.aaStats)} />
            </Form.Item>
        </Form>
    );
}

export default AccountForm