"use client";

import Button from "@/components/atoms/Button";
import Link from "next/link";

export default function ServiceUnavailable() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Service Unavailable
        </h1>
        <p className="text-lg text-gray-600">
          We are currently experiencing issues connecting to our services.
          Please try again in a few moments.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => (window.location.href = "/api/auth/refetch-profile")}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
