import { Metadata } from "next";
import CreateBrokerageClient from "./CreateBrokerageClient";

export const metadata: Metadata = {
  title: "Create Brokerage - Real Estate App",
  description: "Create a new brokerage",
};

export default function CreateBrokeragePage() {
  return <CreateBrokerageClient />;
}
