import {Card, Descriptions, Tag} from "antd";
import React, { useState, useEffect } from "react";

const AgentStatusWidget = props => {

    const [readyColor, setReadyColor] = useState('#f50')
    const [queueColor, setQueueColor] = useState('#f50')
    const [readyStatus, setReadyStatus] = useState("NOT_READY")
    const [queueStatus, setQueueStatus] = useState("NOT_LOGGED_IN")

    useEffect(() => {
        switch (props.isReady && props.isLogin) {
            case true:
                setReadyColor('#52c41a')
                setReadyStatus('READY')
                break
            default:
                setReadyColor('#f50')
                setReadyStatus('NOT_READY')
                break
        }
    }, [props.isReady, props.isLogin])

    useEffect(() => {
        switch (props.isLogin) {
            case true:
                setQueueColor('#52c41a')
                setQueueStatus('LOGGED_IN')
                break
            default:
                setQueueColor('#f50')
                setQueueStatus('NOT_LOGGED_IN')
                break
        }
    }, [props.isLogin])

    return(
        <Card>
            <Descriptions
                bordered
                size="small"
            >
                <Descriptions.Item label={<b>Queue Status</b>}>
                    <Tag color={queueColor}>{queueStatus}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<b>Agent Status</b>}>
                    <Tag color={readyColor}>{readyStatus}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<b>Reason</b>}>
                    {props.reason}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default AgentStatusWidget