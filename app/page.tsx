import type { Metadata } from "next";
import StudentApp from "./student-app";

export const metadata: Metadata = {
  title: "Rentrella Student Web App",
  description: "Student umbrella rental and return web app",
};

export default function Home() {
  return <StudentApp />;
}
