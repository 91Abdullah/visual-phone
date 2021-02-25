import React, { Component, createRef, useState, useEffect, useRef } from "react"
import {
    AudioMutedOutlined,
    CloseCircleFilled,
    CloseOutlined,
    ClusterOutlined,
    CodeOutlined,
    CodeSandboxOutlined,
    ContactsOutlined,
    DeliveredProcedureOutlined,
    GatewayOutlined,
    NotificationOutlined,
    PauseCircleOutlined,
    PhoneFilled,
    PhoneOutlined,
    PhoneTwoTone,
    StopOutlined,
    SwapLeftOutlined,
    SwapOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Button, Card, Col, Descriptions, Divider, Input, Modal, Row, Space, Tag, Typography} from "antd";
import {Inviter, Registerer, RegistererState, SessionState, TransportState, UserAgent, Web} from "sip.js";
import openNotificationWithIcon from "../components/Notification";
import DialerMenu from "./DialerMenu";
import DialerAccount from "./DialerAccount";
//import Timer from "simple-react-timer"
import Timer from "react-compound-timer"
import openSuccessNotificationWithIcon from "../components/Message"
import ring from "../ring.mp3"

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

    useEffect(() => {
        console.log(props.isConnected)
    }, [props.isConnected])

    const initiateTransfer = () => {
        if(transferNumber.length === 0) return
        if(props.transferType === 'blind') props.toggleBlindTransfer(transferNumber)
        else props.toggleAttendedTransfer(transferNumber)
    }

    const handleHold = () => {
        if(props.isHold) {
            props.onUnhold()
        } else {
            props.onHold()
        }
    }

    const handleMute = () => {
        if(props.isMute) {
            props.onUnmute()
        } else {
            props.onMute()
        }
    }

    return(
        <Modal
            title={props.transferType === "blind" ? "Transfer Call" : "Conference"}
            centered
            okText="Dial"
            onOk={initiateTransfer}
            visible={props.visible}
            onCancel={props.onCancel}
        >
            <Input type="text" value={transferNumber} onChange={e => setTransferNumber(e.target.value)} />
            <div style={{ textAlign: 'center', marginTop: 10 }}>
                <Tag>
                    <Timer startTime={Date.now()} />
                </Tag>
                <Tag icon={<PhoneOutlined />} color={props.isConnected ? "green" : "#f50"}>{props.isConnected ? "connected" : "disconnected"}</Tag>
                <Tag icon={<GatewayOutlined />} color={props.isBridged ? "green" : "#f50"}>{props.isBridged ? "bridged" : "unbridged"}</Tag>
                <Button onClick={handleHold} disabled={!props.isConnected} danger={props.isHold}>
                    <PauseCircleOutlined />
                </Button>
                <Button onClick={handleMute} disabled={!props.isConnected} danger={props.isMute}>
                    <AudioMutedOutlined />
                </Button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
                <Button onClick={props.onAcceptTransfer} disabled={!props.isConnected}>
                    <PhoneOutlined /> Bridge Call(s)
                </Button>
                <Button onClick={() => {
                    props.onTransferHangup()
                    props.setVisible(false)
                }} disabled={!props.isConnected} type="primary">
                    <StopOutlined /> Hangup
                </Button>
            </div>
        </Modal>
    )
}

const IncomingCall = props => {

    const [timer, setTimer] = useState("00:00")
    const [transferType, setTransferType] = useState('')
    const [visible, setVisible] = useState(false)

    const timerRef = useRef()

    useEffect(() => {
        switch (visible) {
            case true:
                if(props.isConnected && !props.isBridged)
                    props.holdCall()
                break
            case false:
                if(props.isConnected && !props.isBridged)
                    props.unholdCall()
                break
            default:
                break
        }
    }, [visible])

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

    useEffect(() => {
        const current = timerRef.current
        if(props.isConnected && props.incoming) {
            current.start()
        }
        return () => current?.reset()
    }, [props.isConnected])

    if((props.incoming && props.isConnected) || props.isTransferConnected) {
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
                            <SwapOutlined onClick={() => toggleTransfer('blind')} title="Transfer" />,
                            <ContactsOutlined onClick={() => toggleTransfer('attended')} title="Conf" />,
                            /*<SwapOutlined onClick={() => toggleTransfer('attended')} title="Attended Transfer" />*/
                        ]}
                        extra={<CloseOutlined onClick={props.endCall} style={{ fontSize: 10 }} />}
                    >
                        <Tag color={props.isConnected ? "success" : "error"}>{props.isConnected ? "connected" : "disconnected"}</Tag>
                        {/*<Tag>{timer}</Tag>*/}
                        <Tag>
                            {/*<Timer startTime={!!props.isConnected} />*/}
                            <Timer
                                ref={timerRef}
                                startImmediately={false}
                                formatValue={value => `${(value < 10 ? `0${value}` : value)}`}
                            >
                                {({ start, resume, pause, stop, reset, timerState }) => (
                                    <>
                                        <div>
                                            <Timer.Hours />:<Timer.Minutes />:<Timer.Seconds />
                                        </div>
                                    </>
                                )}
                            </Timer>
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
                        onAcceptTransfer={props.onAcceptTransfer}
                        isConnected={props.isTransferConnected}
                        isHold={props.isTransferHold}
                        isMute={props.isTransferMute}
                        onHold={props.onTransferHold}
                        onUnhold={props.onTransferUnhold}
                        onMute={props.onTransferMute}
                        onUnmute={props.onTransferUnmute}
                        onTransferHangup={props.onTransferHangup}
                        isBridged={props.isBridged}
                        setVisible={setVisible}
                    />
                </Col>
            </Row>
        )
    } else return ''
}

export default class SIPModule extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sipDomain: this.props.sipDomain,
            name: this.props.name,
            authUser: this.props.authUser,
            authPass: this.props.authPass,
            wssPort: this.props.wssPort,
            queues: this.props.queues,
            uri: UserAgent.makeURI(`sip:${this.props.authUser}@${this.props.sipDomain}`),
            _transferredSession: null,
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
            sessionState: '',
            isTransferHold: false,
            isTransferMute: false,
            isTransferConnected: false,
            isBridged: false
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
        this.onAcceptTransfer = this.onAcceptTransfer.bind(this)
        this.onTransferHold = this.onTransferHold.bind(this)
        this.onTransferUnhold = this.onTransferUnhold.bind(this)
        this.onTransferMute = this.onTransferMute.bind(this)
        this.onTransferUnmute = this.onTransferUnmute.bind(this)
        this.onTransferHangup = this.onTransferHangup.bind(this)
        this.playRinger = this.playRinger.bind(this)
        this.stopRing = this.stopRing.bind(this)
    }

    setError(error) {
        openNotificationWithIcon(error)
    }

    setNotification(message) {
        openSuccessNotificationWithIcon(message)
    }

    componentWillMount() {
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
        this.mediaElement = createRef()
        this.audioElement = null
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.state.registerer.stateChange.removeListener(this.registerListener)
        this.state._session?.stateChange.removeListener(this.sessionListener)
    }

    playRinger() {
        this.audioElement?.play()
    }

    stopRing() {
        this.audioElement.pause()
        this.audioElement.currentTime = 0
    }

    onInvite(invitation) {
        this.playRinger()
        this.setState({ _session: invitation, isModalVisible: true }, () => {
            this.registerEvents()
        })
        this.setState({ dialedNumber: invitation.remoteIdentity.uri.user })
        this.setState({ incoming: true })
        //invitation.stateChange.addListener(this.sessionListener)
    }

    onTransferHold() {
        const options = {
            sessionDescriptionHandlerModifiers: [Web.holdModifier]
        }

        this.state._transferredSession.invite(options).then(() => this.setState({ isTransferHold: true })).catch(err => this.setError(err.message))
    }

    onTransferUnhold() {
        const options = {
            sessionDescriptionHandlerModifiers: []
        }

        this.state._transferredSession.invite(options).then(() => this.setState({ isTransferHold: false })).catch(err => this.setError(err.message))
    }

    onTransferMute() {
        let pc = this.state._transferredSession.sessionDescriptionHandler.peerConnection
        let senders = pc.getSenders()
        if(senders.length) {
            senders.forEach(sender => {
                if(sender.track) {
                    sender.track.enabled = false
                    this.setState({ isTransferMute: true })
                }
            })
        }
    }

    onTransferUnmute() {
        let pc = this.state._transferredSession.sessionDescriptionHandler.peerConnection
        let senders = pc.getSenders()
        if(senders.length) {
            senders.forEach(sender => {
                if(sender.track) {
                    sender.track.enabled = true
                    this.setState({ isTransferMute: false })
                }
            })
        }
    }

    onHold() {
        const options = {
            sessionDescriptionHandlerModifiers: [Web.holdModifier]
        }

        this.state._session.invite(options).then(() => this.setState({ isHold: true })).catch(err => this.setError(err.message))
    }

    onUnhold() {
        const options = {
            sessionDescriptionHandlerModifiers: []
        }

        this.state._session.invite(options).then(() => this.setState({ isHold: false })).catch(err => this.setError(err.message))
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
        const transferTarget = UserAgent.makeURI(`sip:${target}@${this.state.sipDomain}`)
        if (!transferTarget) {
            throw new Error("Failed to create transfer target URI.");
        }
        this.state._session.refer(transferTarget).then(() => {
            this.setNotification('Call has been transferred')
            this.onEndCall()
        }).catch(error => openNotificationWithIcon(error.message))
    }

    onTransferHangup() {
        if(this.state._transferredSession === null) return
        switch (this.state._transferredSession.state) {
            case SessionState.Initial:
            case SessionState.Establishing:
                if(this.state._transferredSession instanceof Inviter) {
                    // An unestablished outgoing session
                    this.state._transferredSession.cancel().then(res => this.setNotification(res))
                } else {
                    // An unestablished incoming session
                    this.state._transferredSession.reject()
                }
                this.state._transferredSession.stateChange.removeListener(this.sessionListener)
                this.setState({ _transferredSession: null, isTransferMute: false, isTransferHold: false, isTransferConnected: false, isBridged: false })
                break
            case SessionState.Established:
                // An established session
                this.state._transferredSession.bye()
                this.state._transferredSession.stateChange.removeListener(this.sessionListener)
                this.setState({ _transferredSession: null, isTransferMute: false, isTransferHold: false, isTransferConnected: false, isBridged: false })
                break
            case SessionState.Terminating:
            case SessionState.Terminated:
                break
            default:
                // Cannot terminate a session that is already terminated
                break
        }
    }

    onAttendedTransfer(number) {
        // Attended Transfer
        /*transferSession.invite(options).then(r => {
            this.state._session.refer(transferSession)
            this.setState({ _transferredSession: transferSession })
        }).catch(err => {
            this.setError(err.message)
        })*/

        // Attended transfer through aftab project
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

        transferSession.stateChange.addListener(state => {
            switch (state) {
                case SessionState.Initial:
                    break
                case SessionState.Establishing:
                    break
                case SessionState.Established:
                    this.setState({ isTransferConnected: true })
                    const remoteStream = new MediaStream()
                    transferSession.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
                        if(receiver.track) {
                            remoteStream.addTrack(receiver.track)
                        }
                    })
                    this.mediaElement.current.srcObject = remoteStream
                    this.mediaElement.current.play()
                    break
                case SessionState.Terminating:
                case SessionState.Terminated:
                    this.setState({ isTransferConnected: false, _transferSession: null })
                    //this.mediaElement.current.srcObject = null
                    //this.mediaElement.current.pause()
                    break
                default:
                    throw new Error("Unknown session state.")
            }
        })

        transferSession.invite(options).catch(e => console.log(e))
        this.setState({ _transferredSession: transferSession })
    }

    onAcceptTransfer() {

        // Bridging all calls

        const receivedTracks = []
        const sessionA = this.state._session
        const sessionB = this.state._transferredSession

        sessionA.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
            receivedTracks.push(receiver.track)
        })

        sessionB.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
            receivedTracks.push(receiver.track)
        })

        const context = new AudioContext()
        const mediaStream = new MediaStream()

        const sessions = [sessionA, sessionB]
        sessions.forEach(session => {
            const mixedOutput = context.createMediaStreamDestination()
            session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
                receivedTracks.forEach(track => {
                    mediaStream.addTrack(receiver.track)
                    if(receiver.track.id !== track.id) {
                        const sourceStream = context.createMediaStreamSource(new MediaStream([track]))
                        sourceStream.connect(mixedOutput)
                    }
                })
            })

            session.sessionDescriptionHandler.peerConnection.getSenders().forEach(sender => {
                const sourceStream = context.createMediaStreamSource(new MediaStream([sender.track]))
                sourceStream.connect(mixedOutput)
            })

            session.sessionDescriptionHandler.peerConnection.getSenders()[0].replaceTrack(mixedOutput.stream.getTracks()[0])
                .then(r => {
                    this.setState({ isBridged: true }, () => {
                        if(this.state.isHold)
                            this.onUnhold()
                    })
                    console.log('track replaced')
                })
                .catch(e => console.log(`error: ${e}`))
        })

        this.mediaElement.current.srcObject = mediaStream
        this.mediaElement.current.play()
    }

    //function to create conference by mixing audio
    //sessions => array with JsSIP.RTCSessions calls
    //remoteAudioId => the ID of your <audio> element to play the received streams
   conference(sessions, remoteAudioId) {
        //take all received tracks from the sessions you want to merge
        var receivedTracks = [];
        sessions.forEach(function(session) {
            if(session !== null && session !== undefined) {
                session.connection.getReceivers().forEach(function(receiver) {
                    receivedTracks.push(receiver.track);
                });
            }
        });

        //use the Web Audio API to mix the received tracks
        var context = new AudioContext();
        var allReceivedMediaStreams = new MediaStream();

        sessions.forEach(function(session) {
            if(session !== null && session !== undefined) {

                var mixedOutput = context.createMediaStreamDestination();

                session.connection.getReceivers().forEach(function(receiver) {
                    receivedTracks.forEach(function(track) {
                        allReceivedMediaStreams.addTrack(receiver.track);
                        if(receiver.track.id !== track.id) {
                            var sourceStream = context.createMediaStreamSource(new MediaStream([track]));
                            sourceStream.connect(mixedOutput);
                        }
                    });
                });
                //mixing your voice with all the received audio
                session.connection.getSenders().forEach(function(sender) {
                    var sourceStream = context.createMediaStreamSource(new MediaStream([sender.track]));
                    sourceStream.connect(mixedOutput);
                });
                session.connection.getSenders()[0].replaceTrack(mixedOutput.stream.getTracks()[0]);
            }
        });

        //play all received stream to you
        var remoteAudio = document.getElementById('remoteAudioId');
        remoteAudio.srcObject = allReceivedMediaStreams;
        var promiseRemote = remoteAudio.play();
        if(promiseRemote !== undefined) {
            promiseRemote.then(_ => {
                console.log("playing all received streams to you");
            }).catch(error => {
                console.log(error);
            });
        }
    }

    /*onAcceptTransfer() {
        if(this.state._transferredSession) {
            console.log('this is transfer')
            const remoteStream = new MediaStream()
            this.state._session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
                if(receiver.track) {
                    remoteStream.addTrack(receiver.track)
                }
            })
            this.state._transferredSession.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
                if(receiver.track) {
                    remoteStream.addTrack(receiver.track)
                }
            })

        }
    }*/

    //function to create conference by mixing audio
    //sessions => array with JsSIP.RTCSessions calls
    //remoteAudioId => the ID of your <audio> element to play the received streams
    /*onAcceptTransfer() {
        //take all received tracks from the sessions you want to merge
        const sessions = [this.state._session, this.state._transferredSession]
        let receivedTracks = [];
        sessions.forEach(function(session) {
            if(session !== null && session !== undefined) {
                session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(function(receiver) {
                    receivedTracks.push(receiver.track);
                });
            }
        })

        console.log(receivedTracks)

        //use the Web Audio API to mix the received tracks
        let context = new AudioContext();
        let allReceivedMediaStreams = new MediaStream();

        sessions.forEach(function(session) {
            if(session !== null && session !== undefined) {

                let mixedOutput = context.createMediaStreamDestination();

                session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(function(receiver) {
                    receivedTracks.forEach(function(track) {
                        allReceivedMediaStreams.addTrack(receiver.track);
                        if(receiver.track.id !== track.id) {
                            let sourceStream = context.createMediaStreamSource(new MediaStream([track]));
                            sourceStream.connect(mixedOutput);
                        }
                    });
                });
                //mixing your voice with all the received audio
                session.sessionDescriptionHandler.peerConnection.getSenders().forEach(function(sender) {
                    let sourceStream = context.createMediaStreamSource(new MediaStream([sender.track]));
                    sourceStream.connect(mixedOutput);
                });
                session.sessionDescriptionHandler.peerConnection.getSenders()[0].replaceTrack(mixedOutput.stream.getTracks()[0]);
            }
        });

        //play all received stream to you
        this.mediaElement.current.srcObject = allReceivedMediaStreams
        this.mediaElement.current.play()
    }*/

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
                this.stopRing()
                this.attachMedia()
                this.setState({ isConnected: true })
                this.props.setConnected(true)
                //this.setState({ _session: null, isModalVisible: false })
                break
            case SessionState.Terminating:
            case SessionState.Terminated:
                this.stopRing()
                if(!this.state.isTransferConnected) {
                    this.cleanupMedia()
                }
                this.setState({ incoming: false, isConnected: false, _session: null, isModalVisible: false })
                this.props.setConnected(false)
                this.props.setCallHangup(true)
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
        this.stopRing()
        if(this.state._session === null) return
        switch (this.state._session.state) {
            case SessionState.Initial:
            case SessionState.Establishing:
                if(this.state._session instanceof Inviter) {
                    // An unestablished outgoing session
                    this.state._session.cancel().then(res => this.setNotification(res))
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
        //this.registerEvents()
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
                        {
                            !this.state._registered ?
                            <Typography.Title level={4}>Click on <CodeOutlined/> icon to register your phone.</Typography.Title> : <>
                                    <Typography.Title level={4}>Your phone is <span style={{ color: 'green', textDecoration: 'underline' }}>registered</span>. Click on this <StopOutlined /> icon to unregister your phone.</Typography.Title>
                                    <Typography.Title level={4}>Click on <ClusterOutlined /> icon to login into queue(s) <span style={{ color: 'green', textDecoration: 'underline' }}>[{this.state.queues}]</span> and click on <DeliveredProcedureOutlined /> to logout.</Typography.Title>
                                </>
                        }
                    </Typography>
                    <audio ref={this.mediaElement} />
                    <audio ref={e => this.audioElement = e} src={ring} loop={true} />
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
                    onAcceptTransfer={this.onAcceptTransfer}
                    sessionState={this.state.sessionState}
                    isTransferMute={this.state.isTransferMute}
                    isTransferHold={this.state.isTransferHold}
                    onTransferMute={this.onTransferMute}
                    onTransferUnmute={this.onTransferUnmute}
                    onTransferUnhold={this.onTransferUnhold}
                    onTransferHold={this.onTransferHold}
                    isTransferConnected={this.state.isTransferConnected}
                    onTransferHangup={this.onTransferHangup}
                    isBridged={this.state.isBridged}
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
                    onAcceptTransfer={this.onAcceptTransfer}
                    sessionState={this.state.sessionState}
                    isTransferMute={this.state.isTransferMute}
                    isTransferHold={this.state.isTransferHold}
                    onTransferMute={this.onTransferMute}
                    onTransferUnmute={this.onTransferUnmute}
                    onTransferUnhold={this.onTransferUnhold}
                    onTransferHold={this.onTransferHold}
                    isTransferConnected={this.state.isTransferConnected}
                    onTransferHangup={this.onTransferHangup}
                    isBridged={this.state.isBridged}
                />
            </>
        )
    }
}