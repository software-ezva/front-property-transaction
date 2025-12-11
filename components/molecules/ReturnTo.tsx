"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/atoms/Button";

const ReturnTo = ({
  href = "/",
  label = "Back",
}: {
  href?: string;
  label?: string;
}) => {
  return (
    <Link href={href}>
      <Button variant="ghost" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
};
export default ReturnTo;
