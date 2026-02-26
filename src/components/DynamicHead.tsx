"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  favicon: string;
}

export default function DynamicHead({ title, favicon }: Props) {
  useEffect(() => {
    document.title = title;

    const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = favicon;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = favicon;
      document.head.appendChild(newLink);
    }
  }, [title, favicon]);

  return null; 
}
