import React, {Component, createRef, useState, useEffect} from "react"
import {
    AudioMutedOutlined,
    CloseCircleFilled, CloseOutlined,
    CodeOutlined,
    CodeSandboxOutlined, NotificationOutlined,
    PhoneFilled,
    PhoneOutlined, PhoneTwoTone, StopOutlined, SwapLeftOutlined, SwapOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Button, Card, Col, Input, Modal, Row, Tag, Typography} from "antd";
import {Inviter, Registerer, RegistererState, SessionState, TransportState, UserAgent, Web} from "sip.js";
import openNotificationWithIcon from "../components/Notification";
import DialerMenu from "./DialerMenu";
import DialerAccount from "./DialerAccount";
import Timer from "simple-react-timer"

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

export const TransferModal = props => {

    const [transferNumber, setTransferNumber] = useState()

    const initiateTransfer = () => {
        if(transferNumber.length === 0) return
        if(props.transferType === 'blind') props.toggleBlindTransfer(transferNumber)
        else props.toggleAttendedTransfer(transferNumber)
    }

    return(
        <Modal
            title={`Initiate Transfer: ${props.transferType}`}
            centered
            okText="Transfer"
            onOk={initiateTransfer}
            visible={props.visible}
            onCancel={props.onCancel}
        >
            <Input type="text" value={transferNumber} onChange={e => setTransferNumber(e.target.value)} />
        </Modal>
    )
}

const IncomingCall = props => {

    const [timer, setTimer] = useState("00:00")
    const [transferType, setTransferType] = useState('')
    const [visible, setVisible] = useState(false)

    const title = (
        <>
            <PhoneOutlined /> {props.number}
        </>
    )

    const toggleHold = () => {
        if(props.isHold) props.unholdCall()
        else props.holdCall()
    }

    const toggleMute = () => {
        if(props.isMute) props.unmuteCall()
        else props.muteCall()
    }

    const toggleTransfer = type => {
        if(type === 'blind') setTransferType('blind')
        else setTransferType('attended')
        setVisible(true)
    }

    const toggleBlindTransfer = target => {
        props.blindTransfer(target)
    }

    const toggleAttendedTransfer = target => {
        props.attendedTransfer(target)
    }

    const onCancel = () => {
        setVisible(false)
        setTransferType('')
    }

    if(props.incoming && props.isConnected) {
        return(
            <Row style={{ marginTop: 10 }}>
                <Col>
                    <Card
                        style={{ textAlign: 'center' }}
                        size="small"
                        title={title}
                        actions={[
                            <PhoneTwoTone onClick={props.endCall} title="Hangup" twoToneColor="red" />,
                            <AudioMutedOutlined style={{ color: props.isMute ? 'lightcoral' : '' }} onClick={toggleMute} title="Mute" />,
                            <NotificationOutlined style={{ color: props.isHold ? 'lightcoral' : '' }} onClick={toggleHold} title="Hold" />,
                            <SwapOutlined onClick={() => toggleTransfer('attended')} title="Blind Transfer" />,
                            /*<SwapOutlined onClick={() => toggleTransfer('attended')} title="Attended Transfer" />*/
                        ]}
                        extra={<CloseOutlined onClick={props.endCall} style={{ fontSize: 10 }} />}
                    >
                        <Tag color={props.isConnected ? "success" : "error"}>{props.isConnected ? "connected" : "disconnected"}</Tag>
                        {/*<Tag>{timer}</Tag>*/}
                        <Tag>
                            <Timer startTime={Date.now()} />
                        </Tag>
                        {props.isHold ? <Tag icon={<NotificationOutlined />} color="#cd201f">
                            Hold
                        </Tag> : ''}
                        {props.isMute ? <Tag icon={<AudioMutedOutlined />} color="#cd201f">
                            Mute
                        </Tag> : ''}
                    </Card>
                    <TransferModal
                        transferType={transferType}
                        toggleBlindTransfer={toggleBlindTransfer}
                        toggleAttendedTransfer={toggleAttendedTransfer}
                        visible={visible}
                        onCancel={onCancel}
                    />
                </Col>
            </Row>
        )
    } else return ''
}

export default class SIPModule extends Component {
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
            _session: null,
            _connected: false,
            _registered: false,
            userAgent: null,
            registerer: null,
            isModalVisible: false,
            dialedNumber: '',
            incoming: false,
            outgoing: false,
            isConnected: false,
            isHold: false,
            isMute: false,
            sessionState: ''
        }

        this.onEndCall = this.onEndCall.bind(this)
        this.onConnect = this.onConnect.bind(this)
        this.onDisconnect = this.onDisconnect.bind(this)
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
        this.RegisterSIP = this.RegisterSIP.bind(this)
        this.UnregisterSIP = this.UnregisterSIP.bind(this)
        this.onHold = this.onHold.bind(this)
        this.onUnhold = this.onUnhold.bind(this)
        this.onMute = this.onMute.bind(this)
        this.onUnmute = this.onUnmute.bind(this)
        this.onAttendedTransfer = this.onAttendedTransfer.bind(this)
        this.onBlindTransfer = this.onBlindTransfer.bind(this)
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
        console.log('incoming call')
        this.setState({ _session: invitation, isModalVisible: true })
        this.setState({ dialedNumber: invitation.remoteIdentity.uri.user })
        this.setState({ incoming: true })
        //invitation.stateChange.addListener(this.sessionListener)
    }

    onHold() {
        const options = {
            sessionDescriptionHandlerModifiers: [Web.holdModifier]
        }

        this.state._session.invite(options).then(() => this.setState({ isHold: true })).catch(err => console.log(err))
    }

    onUnhold() {
        const options = {
            sessionDescriptionHandlerModifiers: []
        }

        this.state._session.invite(options).then(() => this.setState({ isHold: false })).catch(err => console.log(err))
    }

    onMute() {
        let pc = this.state._session.sessionDescriptionHandler.peerConnection
        let senders = pc.getSenders()
        if(senders.length) {
            senders.forEach(sender => {
                if(sender.track) {
                    sender.track.enabled = false
                    this.setState({ isMute: true })
                }
            })
        }
    }

    onUnmute() {
        let pc = this.state._session.sessionDescriptionHandler.peerConnection
        let senders = pc.getSenders()
        if(senders.length) {
            senders.forEach(sender => {
                if(sender.track) {
                    sender.track.enabled = true
                    this.setState({ isMute: false })
                }
            })
        }
    }

    onBlindTransfer(target) {
        console.log(target, this.state.sipDomain)
        const transferTarget = UserAgent.makeURI(`sip:${target}@${this.state.sipDomain}`)
        if (!transferTarget) {
            throw new Error("Failed to create transfer target URI.");
        }
        console.log(this.state._session)
        this.state._session.refer(transferTarget).then(() => console.log('transfered'))
            .catch(error => openNotificationWithIcon(error.message))
    }

    onAttendedTransfer(number) {
        const target =  UserAgent.makeURI(`sip:${number}@${this.state.sipDomain}`)
        const transferSession = new Inviter(this.state.userAgent, target)
        let constraints = {
            audio: true,
            video: false
        }

        const options = {
            sessionDescriptionHandlerOptions: {
                constraints
            }
        }
        transferSession.invite(options).then(() => {
            this.state._session.refer(transferSession).then(() => console.log('transfer attended')).catch(err => console.log('transfer target error'))
        }).catch(err => console.log(err.message))
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
        this.setState({ sessionState: state })
        switch (state) {
            case SessionState.Initial:
                break
            case SessionState.Establishing:
                break
            case SessionState.Established:
                this.attachMedia()
                this.setState({ isConnected: true })
                break
            case SessionState.Terminating:
            case SessionState.Terminated:
                this.cleanupMedia()
                this.setState({ incoming: false })
                this.setState({ isConnected: false })
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
        const target = UserAgent.makeURI(`sip:${number}@${this.state.sipDomain}`)
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
        if(this.state._session === null) return
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
                this.setState({ _session: null, isModalVisible: false, isMute: false, isHold: false })
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
            <>
                <Card title={cardHeader} size="small">
                    <Typography style={{ textAlign: 'center' }}>
                        <Typography.Title level={4}>Welcome {this.state.name}!</Typography.Title>
                        {!this.state._registered ? <Typography.Title level={4}>Click on this <CodeOutlined/> icon to register your phone.</Typography.Title> : <Typography.Title level={4}>Your phone is <span style={{ color: 'green', textDecoration: 'underline' }}>registered</span>. Click on this <StopOutlined /> icon to unregister your phone.</Typography.Title>}
                    </Typography>
                    <audio ref={this.mediaElement} />
                </Card>
                <IncomingCall
                    isHold={this.state.isHold}
                    isMute={this.state.isMute}
                    unholdCall={this.onUnhold}
                    unmuteCall={this.onUnmute}
                    holdCall={this.onHold}
                    muteCall={this.onMute}
                    endCall={this.onEndCall}
                    number={this.state.dialedNumber}
                    isConnected={this.state.isConnected}
                    incoming={this.state.incoming}
                    blindTransfer={this.onBlindTransfer}
                    attendedTransfer={this.onAttendedTransfer}
                />
                <IncomingModal
                    number={this.state.dialedNumber}
                    isModalVisible={this.state.isModalVisible}
                    onOk={this.onCallAccept}
                    onCancel={this.onEndCall}
                />
                <DialerMenu
                    visible={this.props.dialerVisible}
                    onClose={this.props.onClose}
                    isHold={this.state.isHold}
                    isMute={this.state.isMute}
                    unholdCall={this.onUnhold}
                    unmuteCall={this.onUnmute}
                    holdCall={this.onHold}
                    muteCall={this.onMute}
                    endCall={this.onEndCall}
                    makeCall={this.onMakeCall}
                    number={this.state.dialedNumber}
                    isConnected={this.state.isConnected}
                    blindTransfer={this.onBlindTransfer}
                    attendedTransfer={this.onAttendedTransfer}
                    sessionState={this.state.sessionState}
                />
                <DialerAccount {...this.props} onClose={this.props.onDialerAccountClose} visible={this.props.dialerAccountVisible} />
            </>
        )
    }
}