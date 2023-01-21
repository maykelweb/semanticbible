import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setinput] = useState("");
  const [result, setResult] = useState();
  const [error, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
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
      
      setinput("");

      try {
        const response = await fetch("/api/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vector: data.result }),
        });
  
        const matchData = await response.json();
        if (response.status !== 200) {
          throw matchData.error || new Error(`Request failed with status ${response.status}`);
        }

        // Get the div to place the results
        let resultdiv = document.getElementById("result");
        // Delete all content already inside
        resultdiv.innerHTML = '';
        
        // Append the matches to the results div
        matchData.result.forEach((element) => {
          let p = document.createElement("p");
          p.innerHTML = element.metadata.text;;
          resultdiv.appendChild(p);
        });
      } catch (error) {
        setError(error);
      }
      
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div>
      <Head>
        <title>Semantic Bible</title>
        <link rel="icon" href="/bible-icon.png" />
      </Head>

      <main className={styles.main}>
        <img src="/bible-icon.png" className={styles.icon} />
        <h3>Semantic Bible</h3>
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
        {error && <div className={styles.error}>{error.message}</div>}
        <div id="result" className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
