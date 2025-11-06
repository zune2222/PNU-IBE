import React from "react";
import Head from 'next/head';
import { Header } from '../widgets/Header';
import { Footer } from '../widgets/Footer';
import { ESportsHero } from '../widgets/ESportsHero';
import { ESportsSection } from '../widgets/ESportsSection';

export default function ESports() {
  return (
    <>
      <Head>
        <title>E-Sports 승부 예측 | 부산대학교 정보의생명공학대학 학생회</title>
        <meta name="description" content="부산대학교 정보의생명공학대학 학생회 E-Sports 승부 예측 시스템" />
      </Head>

      <Header />

      <main>
        <ESportsHero />
        <ESportsSection />
      </main>

      <Footer />
    </>
  );
}