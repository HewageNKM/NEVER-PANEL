import {IconFileInvoice, IconLayoutDashboard, IconList, IconUsersGroup} from "@tabler/icons-react";

import {uniqueId} from "lodash";

const Menuitems = [

    {
        id: uniqueId(),
        title: "Dashboard",
        icon: IconLayoutDashboard,
        href: "/dashboard",
    },
    {
        id: uniqueId(),
        title: "Inventory",
        icon: IconList,
        href: "/dashboard/inventory",
    },
    {
        id: uniqueId(),
        title: "Orders",
        icon: IconFileInvoice,
        href: "/dashboard/orders",
    },
    {
        id: uniqueId(),
        title: "Users",
        icon: IconUsersGroup,
        href: "/dashboard/users",
    },
];

export default Menuitems;
