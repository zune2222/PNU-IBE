import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { Header } from "../widgets/Header";
import { Footer } from "../widgets/Footer";

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <>
      <Head>
        <title>
          {statusCode ? `${statusCode} - 페이지 오류` : "클라이언트 오류"} -
          부산대학교 정보의생명공학대학 학생회
        </title>
      </Head>
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-300 mb-4">
              {statusCode || "오류"}
            </div>
            <h1 className="text-3xl font-bold text-gray-700 mb-4 korean-text">
              {statusCode === 404
                ? "페이지를 찾을 수 없습니다"
                : statusCode === 500
                ? "서버 오류가 발생했습니다"
                : "오류가 발생했습니다"}
            </h1>
            <p className="text-gray-500 mb-8 korean-text">
              {statusCode === 404
                ? "요청하신 페이지가 존재하지 않거나 이동되었습니다."
                : statusCode === 500
                ? "서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
                : "예상치 못한 오류가 발생했습니다."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 transition-colors korean-text"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
