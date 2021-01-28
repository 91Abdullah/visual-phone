import { Component } from "react"
import {Layout, Menu} from "antd";
import {CodeOutlined, ContainerOutlined, SettingOutlined, StopOutlined} from "@ant-design/icons";
import DialerMenu from "../dialer/DialerMenu";
import DialerAccount from "../dialer/DialerAccount";
import DialerConfig from "../dialer/DialerConfig";

export default class DialerWrapper extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dialerVisible: false,
            dialerAccountVisible: false
        }

        this.showDialerDrawer = this.showDialerDrawer.bind(this)
        this.onDialerClose = this.onDialerClose.bind(this)
        this.onDialerAccountClose = this.onDialerAccountClose.bind(this)
        this.showDialerAccount = this.showDialerAccount.bind(this)
    }

    showDialerDrawer() {
        this.setState({ dialerVisible: true })
    }

    onDialerClose() {
        this.setState({ dialerVisible: false })
    }

    onDialerAccountClose() {
        this.setState({ dialerAccountVisible: false })
    }

    showDialerAccount() {
        this.setState({ dialerAccountVisible: true })
    }

    render() {
        return (
            <Layout hasSider={true}>
                <Layout.Sider trigger={null} collapsed={true} collapsible={true}>
                    <Menu
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        theme="light"
                        inlineCollapsed={true}
                        style={{ minHeight: '79vh' }}
                    >
                        <Menu.Item onClick={this.showDialerDrawer} key="1" icon={<ContainerOutlined />}>
                            Dialer
                        </Menu.Item>
                        <Menu.Item onClick={this.showDialerAccount} key="2" icon={<SettingOutlined />}>
                            Settings
                        </Menu.Item>
                        <Menu.Item key="3" icon={<CodeOutlined />}>
                            Register
                        </Menu.Item>
                        <Menu.Item key="4" icon={<StopOutlined />}>
                            Unregister
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content style={{
                    margin: '24px 16px',
                }}>
                    <div>This is dialer component</div>
                </Layout.Content>
            </Layout>
        )
    }
}