import { FaPerson, FaUserDoctor } from "react-icons/fa6";
import { DropdownWrapper, DropdownWrapperProps } from "../wrappers/DropdownWrapper";
import { BiSolidClinic } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";


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
            {
                ariaLabel: 'clinic register',
                label: 'register',
                href: '/clinic-register',
                startContent: <BiSolidClinic size={32}/>,
                description: "Clinic register"
            },
            {
                ariaLabel: 'admin register',
                label: 'register',
                href: '/admin-register',
                startContent: <RiAdminFill size={32}/>,
                description: "Admin register"
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