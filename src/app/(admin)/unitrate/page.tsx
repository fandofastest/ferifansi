import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UnitRatePage from "./unitrate";

// Define metadata for the page
export const metadata: Metadata = {
  title: "Unit Rate Management | Ferifansi Admin",
  description: "Manage unit rates, items, and pricing for project estimations",
  keywords: ["Unit Rate", "pricing", "item management", "Ferifansi", "rates"]
};

export default function MainPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Item and Rate" />
      
      <UnitRatePage/>
    
    </>
  );
}