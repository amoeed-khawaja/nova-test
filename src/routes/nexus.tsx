import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL — redirects to /fellowship */
export const Route = createFileRoute("/nexus")({
  beforeLoad: () => {
    throw redirect({ to: "/fellowship" });
  },
});
