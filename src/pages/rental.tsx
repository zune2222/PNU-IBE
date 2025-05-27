import React from "react";
import Head from "next/head";
import { Header } from "../widgets/Header";
import { Footer } from "../widgets/Footer";
import { RentalHero } from "../widgets/RentalHero";
import { RentalList } from "../widgets/RentalList";

export default function RentalPage() {
  return (
    <>
      <Head>
        <title>물품 대여 - 부산대학교 정보의생명공학대학 학생회</title>
        <meta
          name="description"
          content="부산대학교 정보의생명공학대학 학생회에서 제공하는 물품 대여 서비스를 이용하세요."
        />
      </Head>

      <Header />

      <main>
        <RentalHero />
        <RentalList />
      </main>

      <Footer />
    </>
  );
}
