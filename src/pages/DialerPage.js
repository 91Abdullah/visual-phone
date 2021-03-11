import React from "react"
import {useQuery} from "react-query";
import {fetchDomain, fetchQueue, fetchUser} from "../config/queries";
import {Button, Col, Result, Row, Skeleton, Spin} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import SIPConfig from "../classes/SIPConfig";
import SIPModule from "../dialer/SIPModule";
import DialerLayout from "../dialer/DialerLayout";
import DialerMenu from "../dialer/DialerMenu"
import { useEffect } from "react"

const DialerPage = () => {

    const options = {
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    }
    const domainQuery = useQuery('fetchDomain', fetchDomain, options)
    const userQuery = useQuery('fetchUser', fetchUser, options)
    const queueQuery = useQuery('fetchQueue', fetchQueue, options)

    if(userQuery.isSuccess && userQuery.data.type === "Normal") {
        return (
            <Result
                status="error"
                title="401"
                subTitle="Sorry, you are unauthorized to login into this application. Please contact your system administrator."
                extra={<Button icon={<LogoutOutlined />} type="primary">Logout</Button>}
            />
        )
    } else if (userQuery.isError || domainQuery.isError) {
        if(userQuery.isError) {
            return (
                <Result
                    status={userQuery.error.status}
                    title={userQuery.error.status}
                    subTitle={userQuery.error.statusText}
                    extra={<Button onClick={() => window.location.reload()} type="primary">Refresh Page</Button>}
                />
            )
        } else if(domainQuery.isError) {
            return (
                <Result
                    status={domainQuery.error.status}
                    title={domainQuery.error.status}
                    subTitle={domainQuery.error.statusText}
                    extra={<Button onClick={() => window.location.reload()} type="primary">Refresh Page</Button>}
                />
            )
        }
    } else if(domainQuery.isLoading || userQuery.isLoading) {
        return (
            <Row justify="center">
                <Col span={20}>
                    <Skeleton paragraph={{ rows: 10 }} active />
                </Col>
            </Row>
        )
    } else return (
        <Spin spinning={domainQuery.isLoading || userQuery.isLoading}>
            <DialerLayout
                name={userQuery.data.name}
                sipDomain={domainQuery.data.server_address}
                authUser={userQuery.data.auth_username}
                authPass={userQuery.data.auth_password}
                wssPort={domainQuery.data.wss_port}
                queues={queueQuery.data}
            />
        </Spin>
    )
}

export default DialerPage