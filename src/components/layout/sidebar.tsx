import { Sidebar } from "flowbite-react";
import {
  ChartPieIcon,
  InboxIcon,
  UserIcon,
  ShoppingBagIcon,
  ArrowSmallRightIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import {
  AdjustmentsVerticalIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/solid";

export default function SideBar() {
  return (
    <div className="w-fit h-screen border-r border-gray-200 mr-8">
      <Sidebar aria-label="Sidebar menu">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={ChartPieIcon}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={AdjustmentsVerticalIcon}>
              Kanban
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={InboxIcon}>
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={UserIcon}>
              Users
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ShoppingBagIcon}>
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ArrowSmallRightIcon}>
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={TableCellsIcon}>
              Sign Up
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={ChartPieIcon}>
              Upgrade to Pro
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={AdjustmentsVerticalIcon}>
              Documentation
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={LifebuoyIcon}>
              Help
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
