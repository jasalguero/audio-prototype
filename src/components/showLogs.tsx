import useLogStore from "~/hooks/logStore";

export default function ShowLogs() {
  const { logs } = useLogStore();
  return (
    <>
      <h2 className="my-5 text-3xl">Logs</h2>
      <div className="logs h-96 bg-slate-100 rounded-md p-5 overflow-auto mr-2">
        <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
        </ul>
      </div>
    </>
  );
}
