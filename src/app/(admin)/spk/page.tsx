import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SPKPage from "./spkpage";
import Link from 'next/link';

// Define metadata for the page
export const metadata: Metadata = {
  title: "SPK Management | Rifansi Admin",
  description: "Manage SPK (Surat Perintah Kerja) documents and track project status",
  keywords: ["SPK", "project management", "Rifansi", "work order"]
};

export default function MainPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="SPK" />
      
      <SPKPage/>
    
    </>
  );
}