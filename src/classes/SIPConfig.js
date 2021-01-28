import {Inviter, Registerer, RegistererState, SessionState, TransportState, UserAgent, UserAgentState} from "sip.js"
import React, { createRef, useState } from "react"
import {Button, Card, Col, Modal, Row, Tag, Typography} from "antd";
import {
    CloseCircleFilled,
    CodeOutlined,
    CodeSandboxOutlined,
    PhoneFilled,
    PhoneOutlined,
    StopOutlined,
    UserOutlined
} from "@ant-design/icons";
import openNotificationWithIcon from "../components/Notification";

const IncomingModal = ({ isModalVisible, onOk, onCancel, number }) => {

    const modalHeader = (
        <>Incoming call from: {number}</>
    )

    const okProps = {
        icon: <PhoneFilled />,
    }

    const cancelProps = {
        icon: <CloseCircleFilled />,
    }

    return (
        <>
            <Modal
                title="Incoming call"
                visible={isModalVisible}
                onOk={onOk}
                onCancel={onCancel}
                centered={true}
                keyboard={false}
                okText="Accept"
                cancelText="Reject"
                okButtonProps={okProps}
                cancelButtonProps={cancelProps}
            >
                <p>{modalHeader}</p>
            </Modal>
        </>
    );
}

export default class SIPConfig extends React.Component {

    constructor(props) {
        super(props)

        this.mediaElement = createRef()

        this.state = {
            sipDomain: this.props.sipDomain,
            name: this.props.name,
            authUser: this.props.authUser,
            authPass: this.props.authPass,
            wssPort: this.props.wssPort,
            uri: UserAgent.makeURI(`sip:${this.props.authUser}@${this.props.sipDomain}:5060`),
            _session: undefined,
            _connected: false,
            _registered: false,
            userAgent: null,
            registerer: null,
            isModalVisible: false,
            dialedNumber: ''
        }
        /*this.sipDomain = sipDomain
        this.authUser = authUser
        this.authPass = authPass
        this.wssPort = wssPort
        this.uri = UserAgent.makeURI(`sip:${this.authUser}@${this.sipDomain}`)
        this.state._session = undefined
        this.mediaElement = mediaElement
        this._connected = false
        this._registered = false*/

        this.onEndCall = this.onEndCall.bind(this)
        this.onConnect = this.onConnect.bind(this)
        this.onDisconnect = this.onConnect.bind(this)
        this.registerListener = this.registerListener.bind(this)
        this.onInvite = this.onInvite.bind(this)
        this.registerEvents = this.registerEvents.bind(this)
        this.onCallAccept = this.onCallAccept.bind(this)
        this.attachMedia = this.attachMedia.bind(this)
        this.cleanupMedia = this.cleanupMedia.bind(this)
        this.sessionListener = this.sessionListener.bind(this)
        this.setError = this.setError.bind(this)
        this.onMakeCall = this.onMakeCall.bind(this)
        this.getState = this.getState.bind(this)
    }

    setError(error) {
        openNotificationWithIcon(error)
    }

    componentDidMount() {
        this.setState({ userAgent: new UserAgent({
                authorizationUsername: this.state.authUser,
                authorizationPassword: this.state.authPass,
                transportOptions: {
                    server: `wss://${this.state.sipDomain}:${this.state.wssPort}/ws`
                },
                uri: this.state.uri,
                logLevel: "error",
                delegate: {
                    onConnect: this.onConnect,
                    onDisconnect: this.onDisconnect,
                    onRegister: this.onRegister,
                    onInvite: this.onInvite,
                },
            })}, () => {
            this.setState({ registerer: new Registerer(this.state.userAgent)})
        })
    }

    componentWillUnmount() {
        this.state.registerer.stateChange.removeListener(this.registerListener)
        this.state._session?.stateChange.removeListener(this.sessionListener)
    }

    onInvite(invitation) {
        this.setState({ _session: invitation, isModalVisible: true })
        this.setState({ dialedNumber: invitation.remoteIdentity.uri.user })
        //invitation.stateChange.addListener(this.sessionListener)
    }

    onConnect() {
        this.setState({ _connected: true })
    }

    onDisconnect(error) {
        console.log(error)
        this.setState({ _connected: false })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //console.log(prevProps, prevState)
    }

    sessionListener(state) {
        console.log(`Session state changed to ${state}`)
        switch (state) {
            case SessionState.Initial:
                break
            case SessionState.Establishing:
                break
            case SessionState.Established:
                this.attachMedia()
                break
            case SessionState.Terminating:
            case SessionState.Terminated:
                this.cleanupMedia()
                break
            default:
                throw new Error("Unknown session state.")
        }
    }

    registerListener(data) {
        switch (data) {
            case RegistererState.Registered:
                this.setState({ _registered: true })
                break
            case RegistererState.Unregistered:
                this.setState({ _registered: false })
                break;
            case RegistererState.Terminated:
                this.setState({ _registered: false })
                break;
            case RegistererState.Initial:
            default:
                break
        }
    }


    registerEvents() {
        this.state._session.stateChange.addListener(this.sessionListener)
    }

    session() {
        return this.state._session
    }

    getState() {
        return this.state._session?.state
    }

    isConnected() {
        return this.state._connected
    }

    isRegistered() {
        return this.state._registered
    }

    RegisterSIP() {
        this.state.userAgent.start().then(() => {
            this.state.userAgent.transport.stateChange.addListener(data => {
                switch (data) {
                    case TransportState.Disconnected:
                        console.log('transport disconnected')
                        break
                    case TransportState.Connected:
                        console.log('transport connected')
                        break
                    default:
                        break
                }
            })
            // User Agent has started
            this.state.registerer.register().then(res => {
                this.state.registerer.stateChange.addListener(this.registerListener)
            }).catch(error => this.setError(error.message))
        }).catch(error => this.setError(error.message))
    }

    UnregisterSIP() {
        this.state.registerer.unregister().then(res => console.log(res))
            .catch(error => this.setError(error.message))
    }

    onMakeCall(number) {
        const target = UserAgent.makeURI(`sip:${number}@${this.state.sipDomain}:5060`)
        const inviter = new Inviter(this.state.userAgent, target)
        let constraints = {
            audio: true,
            video: false
        }

        const options = {
            sessionDescriptionHandlerOptions: {
                constraints
            }
        }
        inviter.invite(options).then(res => console.log(res)).catch(error => this.setError(error.message))
        this.setState({ _session: inviter }, () => this.registerEvents())
    }

    onEndCall() {
        switch (this.state._session.state) {
            case SessionState.Initial:
            case SessionState.Establishing:
                if(this.state._session instanceof Inviter) {
                    // An unestablished outgoing session
                    this.state._session.cancel().then(res => console.log(res))
                } else {
                    // An unestablished incoming session
                    this.state._session.reject()
                }
                this.setState({ _session: null, isModalVisible: false })
                break
            case SessionState.Established:
                // An established session
                this.state._session.bye().then(res => console.log(res))
                this.setState({ _session: null, isModalVisible: false })
                break
            case SessionState.Terminating:
            case SessionState.Terminated:
                this.state._session.stateChange.removeListener(this.sessionListener)
                this.setState({ _session: null, isModalVisible: false })
                break
            default:
                // Cannot terminate a session that is already terminated
                break
        }
    }

    onCallAccept() {
        let constraints = {
            audio: true,
            video: false
        }

        const options = {
            sessionDescriptionHandlerOptions: {
                constraints
            }
        }

        this.state._session.accept(options).then(res => console.log(res))
        this.registerEvents()
        this.setState({ isModalVisible: false })
    }

    attachMedia() {
        const remoteStream = new MediaStream()
        this.state._session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
            if(receiver.track) {
                remoteStream.addTrack(receiver.track)
            }
        })
        this.mediaElement.current.srcObject = remoteStream
        this.mediaElement.current.play()
    }

    cleanupMedia() {
        this.mediaElement.current.srcObject = null
        this.mediaElement.current.pause()
    }

    render() {

        console.log(this.state._connected, this.state._registered)

        const cardHeader = (
            <Row justify="space-between">
                <Col>
                    <Tag color={this.state._registered ? "#87d068" : "#cd201f"} icon={<PhoneOutlined />}>{this.state._registered ? 'online' : 'offline'}</Tag>
                </Col>
                <Col>
                    <Tag icon={<UserOutlined />}>{this.state.authUser}</Tag>
                </Col>
                <Col>
                    <Tag color={this.state._connected ? "#87d068" : "#cd201f"}  icon={<CodeSandboxOutlined />}>{this.state._connected ? 'online' : 'offline'}</Tag>
                </Col>
            </Row>
        )

        return (
            <Card title={cardHeader} size="small">
                <Typography style={{ textAlign: 'center' }}>
                    <Typography.Title level={4}>Welcome {this.state.name}!</Typography.Title>
                    {!this.state._registered ? <Typography.Title level={4}>Click on this <CodeOutlined/> icon to register your phone.</Typography.Title> : <Typography.Title level={4}>Your phone is <span style={{ color: 'green', textDecoration: 'underline' }}>registered</span>. Click on this <StopOutlined /> icon to unregister your phone.</Typography.Title>}
                </Typography>
                <audio ref={this.mediaElement} />
                <IncomingModal number={this.state.dialedNumber} isModalVisible={this.state.isModalVisible} onOk={this.onCallAccept} onCancel={this.onEndCall} />
            </Card>
        )
    }
}