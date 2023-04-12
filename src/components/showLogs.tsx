import useLogStore from "~/hooks/logStore";

export default function ShowLogs() {
  const { logs } = useLogStore();
  return (
    <>
      <h2 className="my-5 text-3xl">Logs</h2>
      <div className="logs mr-2 h-96 overflow-auto rounded-md bg-black p-5 text-white font-mono ">
        <pre>
          <code>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </code>
        </pre>
      </div>
    </>
  );
}
