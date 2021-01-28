import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import {useQuery} from "react-query";
import {fetchDomain, fetchUser} from "../config/queries";
import {Button, Card, Col, Result, Row, Spin, Tag, Typography} from "antd";
import {CodeOutlined, CodeSandboxOutlined, LogoutOutlined, PhoneOutlined, UserOutlined} from "@ant-design/icons";
import SIPConfig from "../classes/SIPConfig";

const DialerConfig = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        registerPhone: () => sipClientRef.current.RegisterSIP(),
        isRegistered: () => sipClientRef.current.isRegistered(),
        unregisterPhone: () => sipClientRef.current.UnregisterSIP(),
        makeCall: number => sipClientRef.current.onMakeCall(number),
    }))

    const domainQuery = useQuery('fetchDomain', fetchDomain)
    const userQuery = useQuery('fetchUser', fetchUser)

    const sipClientRef = useRef()

    const registerPhone = () => {
        sipClientRef.current.RegisterSIP()
    }

    const unregisterPhone = () => {
        sipClientRef.current.UnregisterSIP()
    }

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
        console.log(userQuery.error, domainQuery.error)
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
            <div>Loading...</div>
        )
    } else return (
        <Spin spinning={domainQuery.isLoading || userQuery.isLoading}>
            <SIPConfig ref={sipClientRef} name={userQuery.data.name} sipDomain={domainQuery.data.server_address} authUser={userQuery.data.auth_username} authPass={userQuery.data.auth_password} wssPort={domainQuery.data.wss_port} />
        </Spin>
    )
})

export default DialerConfig