import DialerMenu from "../dialer/DialerMenu";
import {Button, Layout, Menu} from "antd";
import {useState, useRef, useEffect} from "react"
import {
    CheckCircleOutlined, CloseCircleOutlined,
    ClusterOutlined,
    CodeOutlined, ContainerOutlined, DeliveredProcedureOutlined, LoginOutlined, LogoutOutlined,
    SettingOutlined, StopOutlined
} from "@ant-design/icons";
import DialerAccount from "../dialer/DialerAccount";
import DialerConfig from "../dialer/DialerConfig";
import SIPModule from "./SIPModule";
import {login} from "../config/routes";
import {useQuery, useQueryClient} from "react-query";
import {fetchIsReady, fetchLoginQueue, fetchLogoutQueue, fetchNotReadyQueue, fetchReadyQueue} from "../config/queries";
import openSuccessNotificationWithIcon from "../components/Message";
import openNotificationWithIcon from "../components/Notification";

export default function DialerLayout(props) {

    const queryClient = useQueryClient()

    const loginQueueQuery = useQuery('loginQueue', fetchLoginQueue, {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: false
    })
    const logoutQueueQuery = useQuery('logoutQueue', fetchLogoutQueue, {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: false
    })
    const readyQueueQuery = useQuery('readyQueue', fetchReadyQueue, {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: false
    })
    const notReadyQueueQuery = useQuery('notReadyQueue', fetchNotReadyQueue, {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: false
    })
    const isReadyQuery = useQuery('isReadyQuery', fetchIsReady)
    const [dialerVisible, setDialerVisible] = useState(false)
    const [dialerAccountVisible, setDialerAccountVisible] = useState(false)
    const sipModule = useRef()

    useEffect(() => {
        console.log(isReadyQuery.data)
    }, [isReadyQuery.data])

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

    /**
     * Login to queue function
     */
    const loginQueue = () => {
        // Login queue
        loginQueueQuery.refetch().then(r => {
            switch (r.data.response) {
                case "Success":
                    openSuccessNotificationWithIcon(r.data.message)
                    break
                case "Error":
                    openNotificationWithIcon(r.data.message)
                    break
                default:
                    break
            }
        }).catch(e => console.log(e))
    }

    /**
     * Logout from queue
     */
    const logoutQueue = () => {
        // Logout queue
        logoutQueueQuery.refetch().then(r => {
            switch (r.data.response) {
                case "Success":
                    openSuccessNotificationWithIcon(r.data.message)
                    break
                case "Error":
                    openNotificationWithIcon(r.data.message)
                    break
                default:
                    break
            }
        }).catch(e => console.log(e))
    }

    /**
     * Unpause agent
     */
    const readyAgent = () => {
        // Ready agent
        readyQueueQuery.refetch().then(r => {
            switch (r.data.response) {
                case "Success":
                    openSuccessNotificationWithIcon(r.data.message)
                    break
                case "Error":
                    openNotificationWithIcon(r.data.message)
                    break
                default:
                    break
            }
        }).then(() => queryClient.invalidateQueries('isReadyQuery')).catch(e => console.log(e))
    }

    /**
     * Pause agent
     */
    const notReadyAgent = () => {
        // Not Ready agent
        notReadyQueueQuery.refetch().then(r => {
            switch (r.data.response) {
                case "Success":
                    openSuccessNotificationWithIcon(r.data.message)
                    break
                case "Error":
                    openNotificationWithIcon(r.data.message)
                    break
                default:
                    break
            }
        }).then(() => queryClient.invalidateQueries('isReadyQuery')).catch(e => console.log(e))
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
                    <Menu.Item onClick={loginQueue} key="5" icon={<ClusterOutlined />}>
                        Queue Login
                    </Menu.Item>
                    <Menu.Item onClick={logoutQueue} key="6" icon={<DeliveredProcedureOutlined />}>
                        Queue Logout
                    </Menu.Item>
                    <Menu.Item disabled={isReadyQuery.data} onClick={readyAgent} key="7" icon={<CheckCircleOutlined />}>
                        Ready
                    </Menu.Item>
                    <Menu.Item disabled={!isReadyQuery.data} onClick={notReadyAgent} key="8" icon={<CloseCircleOutlined />}>
                        Not Ready
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
                    queues={props.queues}
                />
            </Layout.Content>
        </Layout>
    )
}