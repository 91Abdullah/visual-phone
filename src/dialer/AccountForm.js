import { Form, Input, Button } from 'antd'
import  { useEffect } from "react"

const AccountForm = props => {

    const [form] = Form.useForm()

    const onFinish = (values) => {
        console.log(values)
    }

    useEffect(() => form.resetFields(), [props])

    return (
        <Form form={form} name="nest-messages" onFinish={onFinish} initialValues={{ username: props.authUser, password: props.authPass, domain: props.sipDomain, name: props.name }}>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input placeholder="Password" />
            </Form.Item>
            <Form.Item
                name="domain"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input placeholder="Domain" />
            </Form.Item>
            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
}

export default AccountForm