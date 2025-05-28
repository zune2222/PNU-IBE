import Head from "next/head";
import { Header } from "../widgets/Header";
import { Hero } from "../widgets/Hero";
import { AboutSection } from "../widgets/AboutSection";
import { EventsSection } from "../widgets/EventsSection";
import { Footer } from "../widgets/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>부산대학교 정보의생명공학대학 학생회 정의</title>
        <meta
          name="description"
          content="부산대학교 정보의생명공학대학 제2대 학생회 정의 공식 홈페이지입니다."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Hero />
          <AboutSection />
          <EventsSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
