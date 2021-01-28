import {notification} from "antd";

const openNotificationWithIcon = (message) => {
    notification['error']({
        message: 'Error',
        description: message,
    });
}

export default openNotificationWithIcon