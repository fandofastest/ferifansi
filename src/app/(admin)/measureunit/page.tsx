import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MeasureUnitContent from "./MeasureUnitContent";

export const metadata: Metadata = {
  title: "Measure Unit | Ferifansi Admin",
  description: "Manage measurement units for products",
  keywords: ["measure", "unit", "quantity", "management", "Ferifansi"]
};

export default function MeasureUnitPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Measure Unit" />
      <MeasureUnitContent />
    </>
  );
}