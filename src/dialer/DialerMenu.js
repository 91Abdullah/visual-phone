import { useState, useEffect } from "react";
import {Badge, Button, Card, Col, Divider, Drawer, Input, Menu, Row, Tag, Typography} from "antd";
import {
    AudioMutedOutlined,
    ContainerOutlined, EditOutlined, EllipsisOutlined,
    LeftSquareOutlined,
    PaperClipOutlined,
    PauseCircleOutlined, PhoneFilled, PhoneOutlined, PoweroffOutlined,
    SettingOutlined, SwapLeftOutlined, SwapOutlined
} from "@ant-design/icons";
import {TransferModal} from "./SIPModule"
import Timer from "simple-react-timer"

export default function DialerMenu({ visible, onClose, makeCall, ...props }) {

    const [dialNumber, setDialNumber] = useState('')
    const [onCall, setOnCall] = useState(false)
    const [timer, setTimer] = useState('00:00')
    const [transferVisible, setTransferVisible] = useState(false)
    const [transferType, setTransferType] = useState(false)

    const { SubMenu } = Menu

    const addDigits = (digit) => {
        setDialNumber(dialNumber => dialNumber + digit)
    }

    const removeDigits = () => {
        setDialNumber(dialNumber => dialNumber.slice(0, -1))
    }

    const onMakeCall = () => {
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
                <div style={{ marginBottom: 10 }}>
                    {/*<Badge status={props.isConnected ? 'success' : 'error'} text={<b style={{ textDecoration: 'underline', color: props.isConnected ? 'green' : 'red' }}>{props.isConnected ? 'connected' : 'disconnected'}</b>} />*/}
                    <Tag color={props.isConnected ? 'green' : 'red'}>{props.isConnected ? 'connected' : 'disconnected'}</Tag>
                </div>
                <div
                    style={{
                        marginBottom: 10,
                        border: '1px solid #ccc'
                    }}
                >
                    <Input
                        allowClear={true}
                        prefix={<PhoneOutlined />}
                        bordered={false}
                        placeholder="Enter number"
                        addonAfter={props.isConnected ? <Timer startTime={Date.now()} /> : timer}
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
                    <Row justify="end" gutter={[16, 16]}>
                        <Col>
                            <Button onClick={removeDigits} type="dashed">
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
                            }} title="Blind Transfer">
                                <SwapLeftOutlined />
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button disabled={!props.isConnected} onClick={() => {
                                setTransferType('attended')
                                setTransferVisible(true)
                            }} title="Attended Transfer">
                                <SwapOutlined />
                            </Button>
                        </Col>
                    </Row>
                    <Row justify="center" gutter={[16, 16]}>
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(value => (
                            <Col key={value} span={8}>
                                <Button type="primary" onClick={() => addDigits(value)} block>{value}</Button>
                            </Col>
                        ))}
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Button disabled={props.isConnected} onClick={onMakeCall} block size="large">
                                <PhoneOutlined />
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button danger onClick={props.endCall} block size="large">
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
                    />
                </div>
            </Drawer>
        </>
    )
}