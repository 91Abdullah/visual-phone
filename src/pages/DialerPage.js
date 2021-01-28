import React from "react"
import {useQuery} from "react-query";
import {fetchDomain, fetchUser} from "../config/queries";
import {Button, Col, Result, Row, Skeleton, Spin} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import SIPConfig from "../classes/SIPConfig";
import SIPModule from "../dialer/SIPModule";
import DialerLayout from "../dialer/DialerLayout";
import DialerMenu from "../dialer/DialerMenu";

const DialerPage = () => {

    const domainQuery = useQuery('fetchDomain', fetchDomain)
    const userQuery = useQuery('fetchUser', fetchUser)

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
        } else {
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
                    <Skeleton avatar paragraph={{ rows: 10 }} active />
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
            />
        </Spin>
    )
}

export default DialerPage