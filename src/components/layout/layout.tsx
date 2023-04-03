import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex h-full">
          <Sidebar />
          <main className="mt-4 h-full w-full">{children}</main>
        </div>
      </div>
    </>
  );
}
