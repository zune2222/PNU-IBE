import React from "react";
import Head from "next/head";
import { ReturnApplication } from "../widgets/ReturnApplication";

export default function ReturnApplicationPage() {
  return (
    <>
      <Head>
        <title>물품 반납 신청 - PNU IBE</title>
      </Head>
      <ReturnApplication />
    </>
  );
}
