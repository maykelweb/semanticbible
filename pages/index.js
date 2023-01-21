import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setinput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    const model = "text-embedding-ada-002";
    const data = { input: input, model: model };

    fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        //With the data, do a pinecone index query to get the most similar verses
        let vector = data.data[0].embedding
        const pineData = { vector: vector, topK: 5, includeValues: true };

        fetch("https://bible-dca5782.svc.us-west1-gcp.pinecone.io/query", {
          method: "POST",
          headers: {
            "Api-Key": `1a9139db-0e60-4269-bcac-86fc83092781`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(pineData)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });

        //setResult(data);
      })
      .catch(error => {
        console.error(error);
      });
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
