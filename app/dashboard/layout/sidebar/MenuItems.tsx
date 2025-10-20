import { IoIosApps } from "react-icons/io";
import { IconShoppingCart, IconReportMoney, IconUsersGroup, IconUser, IconLayoutDashboard, IconList, IconFileInvoice } from "@tabler/icons-react";
import { uniqueId } from "lodash";

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
    title: "Master Data",
    icon: IoIosApps,
    children: [
    //   { id: uniqueId(), title: "Categories", href: "/dashboard/master/categories" },
      { id: uniqueId(), title: "Products", href: "/dashboard/master/products" },
    //   { id: uniqueId(), title: "Brands", href: "/dashboard/master/brands" },
    //   { id: uniqueId(), title: "Sizes", href: "/dashboard/master/sizes" },
    ],
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
    subHeader: "Reports",
    navLabel: true,
  },
  {
    id: uniqueId(),
    title: "Reports & Analytics",
    icon: IconFileInvoice,
    href: "/dashboard/reports",
  },
];

export default Menuitems;
