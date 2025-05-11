"use client";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const SearchFormResetBtn = () => {
  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;
    if (form) form.reset();
  };
  return (
    <Button type="reset" onClick={reset} className="search-btn text-white">
      <Link href="/">
        <X className="size-5" />
      </Link>
    </Button>
  );
};

export default SearchFormResetBtn;
