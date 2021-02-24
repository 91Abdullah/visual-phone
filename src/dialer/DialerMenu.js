import { useState, useEffect, useRef } from "react";
import {Badge, Button, Card, Col, Divider, Drawer, Input, Menu, Row, Tag, Typography} from "antd";
import {
    AudioMutedOutlined, ContactsOutlined,
    ContainerOutlined, EditOutlined, EllipsisOutlined,
    LeftSquareOutlined,
    PaperClipOutlined,
    PauseCircleOutlined, PhoneFilled, PhoneOutlined, PoweroffOutlined,
    SettingOutlined, SwapLeftOutlined, SwapOutlined
} from "@ant-design/icons";
import {TransferModal} from "./SIPModule"
import Timer from "react-compound-timer"
import {SessionState} from "sip.js";

export default function DialerMenu({ visible, onClose, makeCall, ...props }) {

    const [dialNumber, setDialNumber] = useState('')
    const [timer] = useState('00:00')
    const [transferVisible, setTransferVisible] = useState(false)
    const [transferType, setTransferType] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const timerRef = useRef()

    useEffect(() => {
        if(props.isConnected) {
            timerRef.current?.start()
        } else {
            timerRef.current?.reset()
        }
    }, [props.isConnected])

    useEffect(() => {
        switch (props.sessionState) {
            case SessionState.Establishing:
                setIsLoading(true)
                break
            case SessionState.Established:
                setIsLoading(false)
                break
            default:
                setIsLoading(false)
                break
        }
    }, [props.sessionState])

    const addDigits = (digit) => {
        setDialNumber(dialNumber => dialNumber + digit)
    }

    const removeDigits = () => {
        setDialNumber(dialNumber => dialNumber.slice(0, -1))
    }

    const onMakeCall = () => {
        setIsLoading(true)
        makeCall(dialNumber)
    }

    const initiateHold = () => {
        if(props.isHold) {
            props.unholdCall()
        } else {
            props.holdCall()
        }
    }

    const initiateMute = () => {
        if(props.isMute) {
            props.unmuteCall()
        } else {
            props.muteCall()
        }
    }

    const onTransferCancel = () => {
        setTransferVisible(false)
    }

    return(
        <>
            <Drawer
                title="Dialer"
                placement="right"
                closable={true}
                onClose={onClose}
                visible={visible}
            >
                <div style={{ marginBottom: 8 }}>
                    {/*<Badge status={props.isConnected ? 'success' : 'error'} text={<b style={{ textDecoration: 'underline', color: props.isConnected ? 'green' : 'red' }}>{props.isConnected ? 'connected' : 'disconnected'}</b>} />*/}

                </div>
                <div
                    style={{
                        marginBottom: 8,
                        border: '1px solid #ccc'
                    }}
                >
                    <Input
                        allowClear={true}
                        prefix={<PhoneOutlined />}
                        bordered={false}
                        placeholder="Enter number"
                        addonAfter={props.isConnected ? <Timer ref={timerRef} startImmediately={false} formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}>
                            {({ start, resume, pause, stop, reset, timerState }) => (
                                <>
                                    <Timer.Minutes />:<Timer.Seconds />
                                </>
                            )}
                        </Timer> : timer}
                        value={dialNumber}
                        onChange={e => setDialNumber(e.target.value)}
                    />
                </div>
                {/*<div>
                    <Tag color="#108ee9">
                        <code>1001</code>
                    </Tag>
                    <Tag style={{ float: 'right' }} color="#87d068">
                        <code>online</code>
                    </Tag>
                </div>
                <Divider />
                <div>
                    <Typography.Paragraph editable={{ onChange: setDialNumber }}>{dialNumber}</Typography.Paragraph>
                    <Tag color="#87d068">connected</Tag>
                </div>
                <Divider />*/}
                <div>
                    <Row justify="space-between" gutter={[10, 10]}>
                        <Col>
                            <Tag color={props.isConnected ? 'green' : 'red'}>{props.isConnected ? 'CONNECTED' : 'DISCONNECTED'}</Tag>
                        </Col>
                        <Col>
                            <Button size="small" onClick={removeDigits} type="dashed">
                                <LeftSquareOutlined />
                            </Button>
                        </Col>
                    </Row>
                    <Row gutter={[6, 16]}>
                        <Col span={6}>
                            <Button disabled={!props.isConnected} danger={props.isHold} onClick={initiateHold}>
                                <PauseCircleOutlined />
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button disabled={!props.isConnected} danger={props.isMute} onClick={initiateMute}>
                                <AudioMutedOutlined />
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button disabled={!props.isConnected} onClick={() => {
                                setTransferType('blind')
                                setTransferVisible(true)
                            }} title="Transfer">
                                <SwapOutlined />
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button disabled={!props.isConnected} onClick={() => {
                                setTransferType('attended')
                                setTransferVisible(true)
                            }} title="Conf">
                                <ContactsOutlined />
                            </Button>
                        </Col>
                    </Row>
                    <Row justify="center" gutter={[16, 16]}>
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(value => (
                            <Col key={value} span={8}>
                                <Button onClick={() => addDigits(value)} block>{value}</Button>
                            </Col>
                        ))}
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Button loading={isLoading} disabled={props.isConnected} onClick={onMakeCall} block size="large" icon={<PhoneOutlined />}>Dial</Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" onClick={props.endCall} block size="large">
                                <PoweroffOutlined />
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'center' }}>
                        <Tag icon={<PhoneOutlined />} color="#3b5999">
                            Call status: <b>{props.sessionState}</b>
                        </Tag>
                    </div>
                    <TransferModal
                        transferType={transferType}
                        visible={transferVisible}
                        onCancel={onTransferCancel}
                        toggleBlindTransfer={props.blindTransfer}
                        toggleAttendedTransfer={props.attendedTransfer}
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
                    />
                </div>
            </Drawer>
        </>
    )
}