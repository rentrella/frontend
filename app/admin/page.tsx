import type { Metadata } from "next";
import AdminDashboard from "./admin-dashboard";

export const metadata: Metadata = {
  title: "Rentrella Admin",
  description: "Umbrella rental security, lock, log, and message dashboard",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
