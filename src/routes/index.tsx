import { createFileRoute } from "@tanstack/react-router";
import { LudoApp } from "@/components/ludo/LudoApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <LudoApp />;
}
