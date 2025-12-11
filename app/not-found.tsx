"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import Button from "@/components/atoms/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center animate-fade-in">
      <div className="bg-primary/5 p-10 rounded-full mb-8 animate-in zoom-in duration-700">
        <FileQuestion className="w-60 h-60 text-primary animate-pulse" />
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-2 font-primary animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 text-lg animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved or doesn&apos;t exist.
      </p>
      <div className="flex gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
