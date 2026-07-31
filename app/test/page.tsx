"use client"
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function DebugAuth() {
  const auth = useAuth();

  useEffect(() => {
    console.log("from test",auth);
  }, [auth]);

  return null;
}