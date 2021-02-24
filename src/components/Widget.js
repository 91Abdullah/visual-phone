import {Button, Card, Descriptions} from "antd"
import {ReloadOutlined} from "@ant-design/icons";

const Widget = props => {

    const { data, title, reload } = props

    return(
        <Card title={title} style={{ marginTop: 10 }} extra={<Button onClick={reload} title="Reload" icon={<ReloadOutlined />} />}>
            <Descriptions
                bordered
                layout="vertical"
            >
                {data && Object.keys(data).map((value, index) => (<Descriptions.Item key={index} label={value}>{data[value]}</Descriptions.Item>))}
            </Descriptions>
        </Card>
    )
}

export default Widget