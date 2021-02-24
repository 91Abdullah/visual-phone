import { useEffect, useState } from "react"
import {Card, Table} from "antd";


const CallDetailWidget = props => {
    const dataSource = props.data

    const columns = [
        {
            title: 'Account',
            dataIndex: 'accountcode',
            key: 'accountcode',
        },
        {
            title: 'Source',
            dataIndex: 'src',
            key: 'src',
        },
        {
            title: 'Dest.',
            dataIndex: 'dst',
            key: 'dst',
        },
        {
            title: 'CLID',
            dataIndex: 'clid',
            key: 'clid',
        },
        {
            title: 'Channel',
            dataIndex: 'channel',
            key: 'channel',
        },
        {
            title: 'Dest. Chan.',
            dataIndex: 'dstchannel',
            key: 'dstchannel',
        },
        {
            title: 'Last App',
            dataIndex: 'lastapp',
            key: 'lastapp',
        },
        {
            title: 'Start',
            dataIndex: 'start',
            key: 'start',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'End',
            dataIndex: 'end',
            key: 'end',
        },
        {
            title: 'dur.',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Bill Sec.',
            dataIndex: 'billsec',
            key: 'billsec',
        },
        {
            title: 'Disp.',
            dataIndex: 'disposition',
            key: 'disposition',
        },
    ]
    return(
        <Card>
            <Table loading={props.loading} scroll={{x: true}} dataSource={dataSource} columns={columns} />
        </Card>
    )
}

export default CallDetailWidget