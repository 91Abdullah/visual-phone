import DialerMenu from "../dialer/DialerMenu";
import {Button, Card, Col, Descriptions, Layout, Menu, Row, Spin} from "antd";
import React, {useState, useRef, useEffect} from "react"
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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    fetchACDRs, fetchAgentStatusInQueue,
    fetchAStats, fetchChannelId,
    fetchIsReady,
    fetchLoginQueue,
    fetchLogoutQueue,
    fetchNotReadyQueue, fetchPauseReasons,
    fetchQStats,
    fetchReadyQueue, fetchWorkcodes
} from "../config/queries";
import openSuccessNotificationWithIcon from "../components/Message";
import openNotificationWithIcon from "../components/Notification";
import Widget from "../components/Widget";
import CallDetailWidget from "../components/CallDetailWidget";
import {useStorageState} from "react-storage-hooks"
import Workcode from "../components/Workcode";
import {postNotReady, postWorkcode} from "../config/mutations";
import NotReady from "../components/NotReady";
import AgentStatusWidget from "../components/AgentStatusWidget";

export default function DialerLayout(props) {

    const queryClient = useQueryClient()

    const [queueStats, setQueueStats, writeErrorQueue] = useStorageState(localStorage, 'queue-stats', false)
    const [agentStats, setAgentStats, writeErrorAgent] = useStorageState(localStorage, 'agent-stats', false)
    const [cdrStats, setCdrStats, writeErrorCdr] = useStorageState(localStorage, 'cdr-stats', false)
    const [aaStats, setAaStats, writeErrorAa] = useStorageState(localStorage, 'aa-stats', false)
    
    // State vars
    const [connected, setConnected] = useState(false)
    const [callHangup, setCallHangup] = useState(false)
    const [channelId, setChannelId] = useState(false)
    const [notReadyVisible, setNotReadyVisible] = useState(false)
    const [notReadyReason, setNotReadyReason] = useState(false)

    const settingsProps = {
        queueStats,
        setQueueStats,
        agentStats,
        setAgentStats,
        cdrStats,
        setCdrStats,
        aaStats,
        setAaStats
    }

    // Mutatations
    const notReadyMutation = useMutation(postNotReady, {
        onSuccess: (r, variables) => {
            setNotReadyVisible(false)
            queryClient.invalidateQueries('isReadyQuery').catch(e => console.log(e))
            queryClient.invalidateQueries('aStats').catch(e => console.log(e))
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
        },
        onError: (error, variables) => {
            console.log(error)
        }
    })

    const qStatsQuery = useQuery('qStats', fetchQStats)
    const aStatsQuery = useQuery('aStats', fetchAStats)
    const aCDRQuery = useQuery('aCDR', fetchACDRs)
    const workcodeQuery = useQuery('workCode', fetchWorkcodes)
    const pauseReasonQuery = useQuery('pauseReason', fetchPauseReasons)
    const agentStatusInQueue = useQuery('agentStatusInQueue', fetchAgentStatusInQueue)

    const getChannelIdQuery = useQuery('getChannelId', fetchChannelId, {
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: false
    })

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
    let sipModule = null

    useEffect(() => {
        console.log(isReadyQuery.data)
    }, [isReadyQuery.data])

    useEffect(() => {
        if(connected) {
            getChannelIdQuery.refetch().then(r => setChannelId(r.data))
        }
    }, [connected])

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
        sipModule.RegisterSIP()
    }

    const unregisterSIP = () => {
        sipModule.UnregisterSIP()
    }

    const refreshQStats = () => {
        queryClient.invalidateQueries('qStats')
    }

    const refreshAStats = () => {
        queryClient.invalidateQueries('aStats')
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
        }).then(() => queryClient.invalidateQueries('agentStatusInQueue')).catch(e => console.log(e))
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
        }).then(() => queryClient.invalidateQueries('agentStatusInQueue')).catch(e => console.log(e))
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
        setNotReadyVisible(true)
    }

    const submitNotReady = () => {
        notReadyMutation.mutate({ reason: notReadyReason })
        // Not Ready agent
        /*notReadyMutation.mutate   ({ reason: notReadyReason }).then(r => {
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
        }).then(() => queryClient.invalidateQueries('isReadyQuery')).catch(e => console.log(e))*/
    }

    const submitWorkcode = workcode => {
        //mutation.mutate({ code: workcode, channel: channelId })
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
                    ref={elem => sipModule = elem}
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
                    setConnected={setConnected}
                    setCallHangup={setCallHangup}
                />
                <AgentStatusWidget isLogin={agentStatusInQueue.data} isReady={isReadyQuery.data} reason={aStatsQuery.data?.Pausedreason} />
                <Workcode submitWorkcode={submitWorkcode} setCallHangup={setCallHangup} callHangup={callHangup} data={workcodeQuery.data} />
                <NotReady setNotReadyReason={setNotReadyReason} onOk={submitNotReady} onCancel={() => setNotReadyVisible(false)} visible={notReadyVisible} data={pauseReasonQuery.data} />
                <DialerAccount onClose={onDialerAccountClose} visible={dialerAccountVisible} {...settingsProps} />
                <Row>
                    {queueStats && <Col span={12}>
                        <Spin spinning={qStatsQuery.isLoading}>
                            <Widget reload={refreshQStats} data={qStatsQuery.data} title="Queue-stats"/>
                        </Spin>
                    </Col>}
                    {agentStats && <Col span={12}>
                        <Spin spinning={aStatsQuery.isLoading}>
                            <Widget reload={refreshAStats} data={aStatsQuery.data} title="Agent-stats"/>
                        </Spin>
                    </Col>}
                    {cdrStats && <Col span={24}>
                        <CallDetailWidget loading={aCDRQuery.isLoading} data={aCDRQuery.data}/>
                    </Col>}
                </Row>
            </Layout.Content>
        </Layout>
    )
}