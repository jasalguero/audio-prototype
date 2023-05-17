import { Sidebar } from "flowbite-react";
import {
  ChartPieIcon,
  InboxIcon,
  UserIcon,
  ArrowSmallRightIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { LifebuoyIcon } from "@heroicons/react/24/solid";

export default function SideBar() {
  return (
    <div className="mr-8 h-full w-fit border-r border-gray-200">
      <Sidebar aria-label="Sidebar menu">
        <Sidebar.Items className="h-full flex flex-col justify-between">
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/teacher" icon={ChartPieIcon}>
              Teacher
            </Sidebar.Item>
            <Sidebar.Item href="/teacher/students" icon={InboxIcon}>
              Logged in Students
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={UserIcon}>
              Users
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup className="hello">
            <Sidebar.Item href="#" icon={ArrowSmallRightIcon}>
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={BookOpenIcon}>
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
