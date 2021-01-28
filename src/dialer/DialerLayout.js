import DialerMenu from "../dialer/DialerMenu";
import {Button, Layout, Menu} from "antd";
import {useState, useRef, useEffect} from "react"
import {
    CodeOutlined, ContainerOutlined,
    SettingOutlined, StopOutlined
} from "@ant-design/icons";
import DialerAccount from "../dialer/DialerAccount";
import DialerConfig from "../dialer/DialerConfig";
import SIPModule from "./SIPModule";

export default function DialerLayout(props) {

    const [dialerVisible, setDialerVisible] = useState(false)
    const [dialerAccountVisible, setDialerAccountVisible] = useState(false)
    const sipModule = useRef()

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

    const registerSIP = () => {
        sipModule.current.RegisterSIP()
    }

    const unregisterSIP = () => {
        sipModule.current.UnregisterSIP()
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
                    <Menu.Item onClick={registerSIP} key="3" icon={<CodeOutlined />}>
                        Register
                    </Menu.Item>
                    <Menu.Item onClick={unregisterSIP} key="4" icon={<StopOutlined />}>
                        Unregister
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout.Content style={{
                margin: '24px 16px',
            }}>
                <SIPModule
                    ref={sipModule}
                    name={props.name}
                    sipDomain={props.sipDomain}
                    authUser={props.authUser}
                    authPass={props.authPass}
                    wssPort={props.wssPort}
                    dialerVisible={dialerVisible}
                    onClose={onDialerClose}
                    onDialerAccountClose={onDialerAccountClose}
                    dialerAccountVisible={dialerAccountVisible}

                />
            </Layout.Content>
        </Layout>
    )
}