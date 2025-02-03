import {
    IconFileInvoice,
    IconLayoutDashboard,
    IconList,
    IconReportMoney,
    IconShoppingCart, IconUser,
    IconUsersGroup
} from "@tabler/icons-react";

import {uniqueId} from "lodash";
import {IoNotifications} from "react-icons/io5";
import {IoIosApps} from "react-icons/io";

const Menuitems = [
    {
        subHeader: "Overview",
        navLabel: true,
    },

    {
        id: uniqueId(),
        title: "Dashboard",
        icon: IconLayoutDashboard,
        href: "/dashboard",
    },
    {
        subHeader: "Management",
        navLabel: true,
    },
    {
        id: uniqueId(),
        title: "Inventory",
        icon: IoIosApps,
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
    {
        id: uniqueId(),
        title: "Profile",
        icon: IconUser,
        href: "/dashboard/profile",
    },
    {
        subHeader: "Settings",
        navLabel: true,
    },
    {
        id: uniqueId(),
        title: "Payments & Shipping",
        icon: IconReportMoney,
        href: "/dashboard/paymentAndShipping",
    },
    {
        id: uniqueId(),
        title: "Website Settings",
        icon: IconList,
        href: "/dashboard/websiteSettings",
    },
    {
        id: uniqueId(),
        title: "Emails & SMS",
        icon: IoNotifications,
        href: "/dashboard/emailsAndSMS",
    },
    {
        subHeader: "Reports",
        navLabel: true,
    },
    {
        id: uniqueId(),
        title: "Reports and Analytics",
        icon: IconFileInvoice,
        href: "/dashboard/reports",
    },
];

export default Menuitems;
