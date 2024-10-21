import { FaPerson, FaUserDoctor } from "react-icons/fa6";
import { DropdownWrapper, DropdownWrapperProps } from "../wrappers/DropdownWrapper";


const dropdownMenu:DropdownWrapperProps = {
    trigger: 'register',
    dropdownMenu: {
        ariaLable: 'register',
        dropItems: [
            {
                ariaLabel: 'patient register',
                label: 'register',
                href: '/register',
                startContent: <FaPerson size={32}/>,
                description: "Patient register"
            },
            {
                ariaLabel: 'doctor register',
                label: 'register',
                href: '/doctor-register',
                startContent: <FaUserDoctor size={32}/>,
                description: "Doctor register"
            },
        ]
    }
}

export default function RegisterMenu() {
    return (
        <DropdownWrapper
            trigger={dropdownMenu.trigger}
            dropdownMenu={dropdownMenu.dropdownMenu}
            placement="bottom-start"
        />
    )
}