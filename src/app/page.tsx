import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Noqclinic MVP Home Page
      <Button
        as={Link}
        href="/session"
      >
        Session Check
      </Button>
    </div>
  );
}
