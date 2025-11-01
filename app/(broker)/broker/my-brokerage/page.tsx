import { Metadata } from "next";
import MyBrokerageClient from "./MyBrokerageClient";

export const metadata: Metadata = {
  title: "My Brokerage - Real Estate App",
  description: "View and manage your brokerage information",
};

export default function MyBrokeragePage() {
  return <MyBrokerageClient />;
}
