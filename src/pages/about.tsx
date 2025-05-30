import React from "react";
import Head from "next/head";
import { Header } from "../widgets/Header";
import { Footer } from "../widgets/Footer";
import { AboutHero } from "../widgets/AboutHero";
import { AboutVision } from "../widgets/AboutVision";
import { AboutMembers } from "../widgets/AboutMembers";
import { AboutHistory } from "../widgets/AboutHistory";
// import { AboutActivities } from "../widgets/AboutActivities";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>학생회 소개 | 부산대학교 정보의생명공학대학 학생회</title>
        <meta
          name="description"
          content="부산대학교 정보의생명공학대학 학생회 소개 페이지입니다."
        />
      </Head>

      <Header />

      <main>
        <AboutHero />
        <AboutVision />
        <AboutMembers />
        <AboutHistory />
        {/* <AboutActivities /> */}
      </main>

      <Footer />
    </>
  );
}
