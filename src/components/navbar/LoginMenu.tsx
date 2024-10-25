import { FaPerson, FaUserDoctor } from "react-icons/fa6";
import { DropdownWrapper, DropdownWrapperProps } from "../wrappers/DropdownWrapper";
import { BiSolidClinic } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";


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
            {
                ariaLabel: 'clinic login',
                label: 'login',
                href: '/clinic-login',
                startContent: <BiSolidClinic size={32}/>,
                description: "Clinic login"
            },
            {
                ariaLabel: 'admin login',
                label: 'login',
                href: '/admin-login',
                startContent: <RiAdminFill size={32}/>,
                description: "Admin login"
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