import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ItemCostContent from "./ItemCostContent";

export const metadata: Metadata = {
  title: "Item Cost | Ferifansi Admin",
  description: "Manage item costs and pricing",
  keywords: ["item", "cost", "pricing", "management", "Ferifansi"]
};

export default function ItemCostPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Item Cost" />
      <ItemCostContent />
    </>
  );
}