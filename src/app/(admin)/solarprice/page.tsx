import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SolarPriceContent from "./SolarPriceContent";

export const metadata: Metadata = {
  title: "Solar Price | Ferifansi Admin",
  description: "Manage solar prices",
  keywords: ["solar", "price", "management", "Ferifansi"]
};

export default function SolarPricePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Solar Price" />
      <SolarPriceContent />
    </>
  );
}