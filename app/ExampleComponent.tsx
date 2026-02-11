import { useEffect, useState } from "react";

export default function ExampleComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err); // Log the error
        setError("Could not load data. Please try again later.");
      }
    }
    fetchData();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>Loading...</div>;
  return <div>{/* render your data */}</div>;
}