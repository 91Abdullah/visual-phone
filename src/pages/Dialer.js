import DialerMenu from "../dialer/DialerMenu";
import {Button, Layout, Menu} from "antd";
import {useState, useRef, useEffect} from "react"
import {
    CodeOutlined, ContainerOutlined,
    SettingOutlined, StopOutlined
} from "@ant-design/icons";
import DialerAccount from "../dialer/DialerAccount";
import DialerConfig from "../dialer/DialerConfig";

export default function Dialer(props) {

    const [dialerVisible, setDialerVisible] = useState(false)
    const [dialerAccountVisible, setDialerAccountVisible] = useState(false)

    const sipConfigRef = useRef()

    const onTestClick = () => {
        console.log(sipConfigRef.current.isRegistered())
    }

    const showDialerDrawer = () => {
        setDialerVisible(true)
    }

    const onDialerClose = () => {
        setDialerVisible(false)
    }

    const onDialerAccountClose = () => {
        setDialerAccountVisible(false)
    }

    const showDialerAccount = () => {
        setDialerAccountVisible(true)
    }

    const registerPhone = () => {
        sipConfigRef.current.registerPhone()
    }

    const unregisterPhone = () => {
        sipConfigRef.current.unregisterPhone()
    }

    const makeCall = number => {
        sipConfigRef.current.makeCall(number)
    }

    return(
        <Layout hasSider={true}>
            <Layout.Sider trigger={null} collapsed={true} collapsible={true}>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={true}
                    style={{ minHeight: '79vh' }}
                >
                    <Menu.Item onClick={showDialerDrawer} key="1" icon={<ContainerOutlined />}>
                        Dialer
                    </Menu.Item>
                    <Menu.Item onClick={showDialerAccount} key="2" icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>
                    <Menu.Item onClick={registerPhone} key="3" icon={<CodeOutlined />}>
                        Register
                    </Menu.Item>
                    <Menu.Item onClick={unregisterPhone} key="4" icon={<StopOutlined />}>
                        Unregister
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout.Content style={{
                margin: '24px 16px',
            }}>
                <DialerMenu makeCall={makeCall} onClose={onDialerClose} visible={dialerVisible} />
                <DialerAccount onClose={onDialerAccountClose} visible={dialerAccountVisible} />
                <DialerConfig ref={sipConfigRef} />
            </Layout.Content>
        </Layout>
    )
}