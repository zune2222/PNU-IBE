import React from "react";
import Head from "next/head";
import { Header } from "../widgets/Header";
import { Footer } from "../widgets/Footer";
import { NoticeHero } from "../widgets/NoticeHero";
import { NoticeList } from "../widgets/NoticeList";

export default function NoticePage() {
  return (
    <>
      <Head>
        <title>공지사항 | 부산대학교 정보의생명공학대학 학생회</title>
        <meta
          name="description"
          content="부산대학교 정보의생명공학대학 학생회 공지사항 페이지입니다."
        />
      </Head>

      <Header />

      <main>
        <NoticeHero />
        <NoticeList />
      </main>

      <Footer />
    </>
  );
}
