import {Alert, Button, Checkbox, Col, Form, Input, notification, Row, Spin} from "antd";
import { Typography } from "antd"
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import apiClient from "../config/apiClient";
import {baseURL} from "../config/baseURL";
import {cookie, login} from "../config/routes"
import { useState, useEffect } from "react"
import {useHistory} from "react-router-dom";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 8,
        offset: 8
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
}

export default function Login(props) {

    const openNotificationWithIcon = (message) => {
        notification['error']({
            message: 'Error',
            description: message,
        });
    }

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    let history = useHistory()

    const onFinish = (values) => {
        setLoading(true)
        apiClient.get(cookie).then(() => {
            apiClient.post(login, {
                username: values.username,
                password: values.password
            }).then(response => {
                setLoading(false)
                console.log(response)
                if(response.status === 200) {
                    localStorage.setItem('loggedin', "true")
                    props.setLoggedin(true)
                } else if(response.status === 302) {
                    // Already logged in
                    history.push('/dialer')
                    props.setLoggedin(true)
                }
            }).catch(error => {
                if(error.response) {
                    console.log(error.response)
                    setError(error.response.data.message)
                    setLoading(false)
                } else {
                    console.log(error.message)
                    setLoading(false)
                    setError(error.message)
                }
            })
        }).catch(error => {
            if(error.response) {
                console.log(error.response)
                setError(error.response.data.message)
                setLoading(false)
            } else {
                console.log(error.message)
                setLoading(false)
                setError(error.message)
            }
        })
    }

    useEffect(() => {
        if(error) {
            openNotificationWithIcon(error)
        }
    }, [error])

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    return(
        <Spin spinning={loading}>
            <Row style={{ marginTop: 50 }}>
                <Col span={8} offset={8}>
                    {error && <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 20 }}
                    />}
                </Col>
            </Row>
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}