import React from "react";
import Head from "next/head";
import { Header } from "../widgets/Header";
import { Footer } from "../widgets/Footer";
import { EventsHero } from "../widgets/EventsHero";
import { EventsList } from "../widgets/EventsList";

export default function EventsPage() {
  return (
    <>
      <Head>
        <title>행사 정보 - 부산대학교 정보의생명공학대학 학생회</title>
        <meta
          name="description"
          content="부산대학교 정보의생명공학대학 학생회에서 진행하는 다양한 행사 정보를 확인하세요."
        />
      </Head>
      <Header />
      <main>
        <EventsHero />
        <EventsList />
      </main>
      <Footer />
    </>
  );
}
