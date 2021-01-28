import {Drawer} from "antd";
import AccountForm from "./AccountForm";
import { useEffect } from "react"

export default function DialerAccount({ visible, onClose, ...props }) {

    return(
        <Drawer
            title="Account Settings"
            placement="right"
            closable={true}
            onClose={onClose}
            visible={visible}
        >
            <AccountForm {...props} />
        </Drawer>
    )
}