import {IconFileInvoice, IconLayoutDashboard, IconList, IconUsersGroup, IconShoppingCart, IconReportMoney} from "@tabler/icons-react";

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
        icon: IconShoppingCart,
        href: "/dashboard/orders",
    },
    {
        id: uniqueId(),
        title: "Reports",
        icon: IconFileInvoice,
        href: "/dashboard/reports",
    },
    {
        id: uniqueId(),
        title: "Expenses",
        icon: IconReportMoney,
        href: "/dashboard/expenses",
    },
    {
        id: uniqueId(),
        title: "Users",
        icon: IconUsersGroup,
        href: "/dashboard/users",
    },
];

export default Menuitems;
