import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setinput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.log(data);
      setinput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }


  return (
    <div>
      <Head>
        <title>Semantic Bible</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Search</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="search"
            placeholder="Enter your search"
            value={input}
            onChange={(e) => setinput(e.target.value)}
          />
          <input type="submit" value="Search" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
