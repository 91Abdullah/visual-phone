import {notification} from "antd";

const openSuccessNotificationWithIcon = (message) => {
    notification['success']({
        message: 'Notification',
        description: message,
    });
}

export default openSuccessNotificationWithIcon