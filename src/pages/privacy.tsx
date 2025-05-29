import React from "react";
import { NextPage } from "next";
import Head from "next/head";

// 개인정보처리방침 내용 컴포넌트 (재사용 가능)
export const PrivacyContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          1. 개인정보의 처리 목적
        </h2>
        <p className="text-gray-600">
          부산대학교 정보의생명공학대학 학생회(이하 &apos;학생회&apos;)는
          학우들의 물품 대여 서비스, 행사 신청 및 진행, 학생회 활동 안내 등을
          위해 필요한 최소한의 개인정보를 처리하고 있습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          2. 수집하는 개인정보 항목
        </h2>
        <p className="text-gray-600">
          학생회는 다음과 같은 개인정보 항목을 수집하고 있습니다:
        </p>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-700">
            물품 대여 서비스
          </h3>
          <ul className="list-disc ml-6 text-gray-600">
            <li>
              필수 정보: 성명, 학번, 연락처, 학과, 모바일 학생증 사본 사진
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          3. 개인정보의 처리 및 보유기간
        </h2>
        <p className="text-gray-600">
          학생회는 물품 대여 서비스의 경우, 대여 신청일로부터 물품 반납 완료 후
          12개월까지 개인정보를 보유합니다. 이 기간이 지난 후에는 해당 정보를
          지체 없이 파기합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          4. 물품 대여 서비스의 개인정보 처리 절차
        </h2>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">
            4.1 대여 신청 시
          </h3>
          <p className="text-gray-600">
            물품 대여 신청 시 수집된 개인정보는 대여 물품 준비, 대여 확인,
            대여자 식별, 분실 및 훼손 시 연락 등의 목적으로만 사용됩니다.
          </p>

          <h3 className="text-lg font-medium text-gray-700 mt-4">
            4.2 대여 기간 중
          </h3>
          <p className="text-gray-600">
            대여 기간 중에는 대여 상태 확인, 반납 기한 안내, 연장 신청 처리 등을
            위해 개인정보가 활용될 수 있습니다.
          </p>

          <h3 className="text-lg font-medium text-gray-700 mt-4">
            4.3 반납 후
          </h3>
          <p className="text-gray-600">
            물품 반납 완료 후에는 물품의 상태 확인 및 추가적인 안내가 필요한
            경우를 제외하고 수집된 개인정보는 12개월 후 자동으로 파기됩니다.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          5. 개인정보의 제3자 제공
        </h2>
        <p className="text-gray-600">
          학생회는 수집된 개인정보를 본래의 목적 이외의 용도로 사용하거나 외부에
          제공하지 않습니다. 다만, 아래의 경우에는 예외적으로 제공될 수
          있습니다:
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>정보주체의 동의가 있는 경우</li>
          <li>법령에 의해 제공이 요구되는 경우</li>
          <li>대학 행정에 필요한 경우(단, 최소한의 정보만 제공)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          6. 개인정보 보호 조치
        </h2>
        <p className="text-gray-600">
          학생회는 수집된 개인정보를 안전하게 보호하기 위해 다음과 같은 조치를
          취하고 있습니다:
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>개인정보에 대한 접근 권한 제한</li>
          <li>정기적인 개인정보 보호 교육 실시</li>
          <li>물리적 보안 장치 마련</li>
          <li>수집된 개인정보는 정해진 기간이 지나면 자동으로 파기</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          7. 정보주체의 권리
        </h2>
        <p className="text-gray-600">
          정보주체는 자신의 개인정보에 대해 다음과 같은 권리를 행사할 수
          있습니다:
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리정지 요구</li>
        </ul>
        <p className="text-gray-600 mt-2">
          위 권리 행사는 학생회에 서면, 전화, 이메일, 인스타그램 DM 등을 통해
          요청하실 수 있습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          8. 개인정보 보호책임자
        </h2>
        <p className="text-gray-600">
          학생회는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
          처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이
          개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <div className="bg-gray-50 p-4 rounded-md mt-2">
          <p className="text-gray-700">
            <span className="font-medium">개인정보 보호책임자</span>
            <br />
            인스타그램: @pnu_ibe
            <br />
            위치: 부산광역시 금정구 부산대학로63번길 2 (장전동) 제6공학관
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          9. 개인정보처리방침 변경
        </h2>
        <p className="text-gray-600">
          이 개인정보처리방침은 2025년 5월 28일부터 적용됩니다. 법령 및 방침에
          따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
          전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </section>
    </div>
  );
};

const Privacy: NextPage = () => {
  return (
    <>
      <Head>
        <title>개인정보처리방침 - 정보의생명공학대학 학생회</title>
        <meta
          name="description"
          content="부산대학교 정보의생명공학대학 학생회 개인정보처리방침"
        />
      </Head>

      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            개인정보처리방침
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <PrivacyContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
