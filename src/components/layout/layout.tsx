import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="mt-4 h-screen w-full">{children}</main>
        </div>
      </div>
    </>
  );
}
