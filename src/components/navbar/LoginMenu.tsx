import { FaPerson, FaUserDoctor } from "react-icons/fa6";
import { DropdownWrapper, DropdownWrapperProps } from "../DropdownWrapper";


const dropdownMenu:DropdownWrapperProps = {
    trigger: 'login',
    dropdownMenu: {
        ariaLable: 'login',
        dropItems: [
            {
                ariaLabel: 'patient login',
                label: 'login',
                href: '/login',
                startContent: <FaPerson size={32}/>,
                description: "Patient login"
            },
            {
                ariaLabel: 'doctor login',
                label: 'login',
                href: '/doctor-login',
                startContent: <FaUserDoctor size={32}/>,
                description: "Doctor login"
            },
        ]
    }
}

export default function LoginMenu() {
    return (
        <DropdownWrapper
            trigger={dropdownMenu.trigger}
            dropdownMenu={dropdownMenu.dropdownMenu}
        />
    )
}