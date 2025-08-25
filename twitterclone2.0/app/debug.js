export async function getServerSideProps() {
  return {
    props: {
      time: Date.now(),
      env: process.env,
    },
  };
}

export default function Debug({ time, env }) {
  return (
    <div>
      <h1>Debug Page</h1>
      <p>Rendered at: {time}</p>
      <pre>{JSON.stringify(env, null, 2)}</pre>
    </div>
  );
}
