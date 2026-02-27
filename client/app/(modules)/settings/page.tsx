'use client'
import { useEffect, useState } from "react";

interface Me {
    username : string,
    email : string,

}



export default function Settings() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const getMyInfo = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = (await res.json()) as Me;
        setMe(data);
      } catch (err) {
        console.error(err);
      }
    };
    getMyInfo();
  }, []);

  if (!me) return <div>Loading…</div>;

  return (
    <div>
      <div>{me.username}</div>
      <div>{me.email}</div>
    </div>
  );
}