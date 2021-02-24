import {Button, Layout, Menu, Spin} from "antd";
import { useState, useEffect } from "react"
import logo from './../bykea.png';
import Login from "./Login"
import {
    useHistory,
    Switch,
    Route,
    Link
} from "react-router-dom"
import Dialer from "./Dialer";
import {LogoutOutlined} from "@ant-design/icons";
import apiClient from "../config/apiClient";
import {cookie, logout} from "../config/routes";
import openNotificationWithIcon from "../components/Notification";
import ErrorBoundary from "./ErrorBoundary";
import DialerWrapper from "./DialerWrapper";
import DialerPage from "./DialerPage";
function Main(props) {

    const [loggedin, setLoggedin] = useState(localStorage.getItem('loggedin') === "true")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    let history = useHistory()

    useEffect(() => {
        if(loggedin) {
            history.push('/dialer')
        } else {
            history.push('/')
        }
    }, [loggedin])

    const handleLogout = () => {
        setLoading(true)
        apiClient.get(cookie).then(() => {
            apiClient.post(logout).then(response => {
                setLoading(false)
                if(response.status === 204) {
                    setLoggedin(false)
                    localStorage.removeItem('loggedin')
                } else {
                    console.log(response)
                }
            }).catch(error => {
                setLoading(false)
                if(error.response) {
                    console.log(error.response)
                    setError(error.response.data.message)
                } else {
                    console.log(error.message)
                    setError(error.message)
                }
            })
        }).catch(error => {
            if(error.response) {
                console.log(error.response)
                setError(error.response.data.message)
            } else {
                console.log(error.message)
                setError(error.message)
            }
        })
    }

    useEffect(() => {
        if(error) {
            openNotificationWithIcon(error)
        }
    }, [error])

    return(
        <Spin spinning={loading}>
            <Layout className="layout" style={{ minHeight: 600 }}>
                <Layout.Header /*style={{ backgroundColor: '#02AA31' }}*/>
                    <img src={logo} alt="HeliPhone Logo" />
                    {loggedin && <div style={{float: 'right'}}>
                        <Button onClick={handleLogout} icon={<LogoutOutlined/>} style={{color: '#fff'}}
                                type="link">Logout</Button>
                    </div>}
                </Layout.Header>
                <Layout.Content>
                    <div className="site-layout-content">
                        <Switch>
                            <Route path="/dialer">
                                <ErrorBoundary>
                                    <DialerPage />
                                </ErrorBoundary>
                            </Route>
                            <Route path="/">
                                <Login setLoggedin={setLoggedin} />
                            </Route>
                        </Switch>
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center', backgroundColor: '#FFF', fontWeight: 'bold' }}>ContactPlus ©2020 | Powered by Telecard Ltd.</Layout.Footer>
            </Layout>
        </Spin>
    )
}

export default Main