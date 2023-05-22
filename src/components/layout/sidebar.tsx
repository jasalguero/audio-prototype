import { Sidebar } from "flowbite-react";
import {
  ChartPieIcon,
  InboxIcon,
  UserIcon,
  ArrowSmallRightIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { LifebuoyIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

export default function SideBar() {
  const { data: session } = useSession();

  const isUserLoggedIn = session?.user;

  return (
    <div className="mr-8 h-full w-fit border-r border-gray-200">
      <Sidebar aria-label="Sidebar menu">
        <Sidebar.Items className="flex h-full flex-col justify-between">
          <Sidebar.ItemGroup>
            {!isUserLoggedIn ? (
              <Sidebar.Item href="/teacher" icon={ChartPieIcon}>
                Teacher Login
              </Sidebar.Item>
            ) : null}
            {isUserLoggedIn ? (
              <Sidebar.Item href="/teacher/students" icon={InboxIcon}>
                Teacher&apos;s students
              </Sidebar.Item>
            ) : null}
            {!isUserLoggedIn ? (
              <Sidebar.Item href="/student" icon={UserIcon}>
                Student Login
              </Sidebar.Item>
            ) : null}
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup className="hello">
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
