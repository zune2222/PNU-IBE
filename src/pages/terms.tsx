import React from "react";
import { NextPage } from "next";
import Head from "next/head";

const Terms: NextPage = () => {
  return (
    <>
      <Head>
        <title>이용약관 - 정보의생명공학대학 학생회</title>
        <meta
          name="description"
          content="부산대학교 정보의생명공학대학 학생회 이용약관"
        />
      </Head>

      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">이용약관</h1>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제1조 (목적)
              </h2>
              <p className="text-gray-600">
                이 약관은 부산대학교 정보의생명공학대학 학생회(이하
                &quot;학생회&quot;)가 제공하는 서비스의 이용조건 및 절차, 회원과
                학생회의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을
                목적으로 합니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제2조 (약관의 효력과 변경)
              </h2>
              <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                <li>
                  이 약관은 학생회 웹사이트에 게시함으로써 효력이 발생합니다.
                </li>
                <li>
                  학생회는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며,
                  변경된 약관은 웹사이트에 공지함으로써 효력이 발생합니다.
                </li>
                <li>
                  회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수
                  있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속
                  이용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제3조 (용어의 정의)
              </h2>
              <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                <li>
                  &quot;서비스&quot;란 학생회가 제공하는 물품 대여, 행사 정보
                  등의 모든 서비스를 의미합니다.
                </li>
                <li>
                  &quot;회원&quot;이란 학생회 서비스에 접속하여 이 약관에
                  동의하고 학생회와 이용계약을 체결한 부산대학교
                  정보의생명공학대학 소속 학생을 의미합니다.
                </li>
                <li>
                  &quot;물품&quot;이란 학생회가 대여 가능하도록 제공하는 모든
                  물품을 의미합니다.
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제4조 (물품 대여 서비스)
              </h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">
                  4.1 물품 대여 서비스의 신청
                </h3>
                <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                  <li>
                    물품 대여 서비스는 정보의생명공학대학 소속 학생만 이용할 수
                    있습니다.
                  </li>
                  <li>
                    물품 대여 신청은 웹사이트를 통해 진행되며, 신청 시 필요한
                    개인정보를 제공해야 합니다.
                  </li>
                  <li>
                    대여 가능한 물품의 종류와 수량은 웹사이트에서 확인할 수
                    있으며, 재고 상황에 따라 대여가 제한될 수 있습니다.
                  </li>
                </ol>

                <h3 className="text-lg font-medium text-gray-700 mt-4">
                  4.2 물품 대여 기간 및 연장
                </h3>
                <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                  <li>물품 대여 기간은 원칙적으로 최대 1일입니다.</li>
                  <li>
                    반납 기한을 초과할 경우, 대여 서비스 이용에 제한이 있을 수
                    있습니다.
                  </li>
                </ol>

                <h3 className="text-lg font-medium text-gray-700 mt-4">
                  4.3 물품 대여 및 반납
                </h3>
                <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                  <li>
                    대여 신청 후 지정된 장소에서 물품을 수령할 수 있습니다.
                  </li>
                  <li>
                    물품 수령 시 물품의 상태를 확인하고, 문제가 있을 경우 즉시
                    학생회에 알려야 합니다.
                  </li>
                  <li>
                    물품은 반납 기한 내에 수령한 장소와 동일한 장소로 반납해야
                    합니다.
                  </li>
                </ol>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제5조 (물품 손상 및 분실)
              </h2>
              <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                <li>
                  대여한 물품을 분실하거나 심각한 손상을 입힌 경우, 회원은 이에
                  대한 책임을 집니다.
                </li>
                <li>
                  경미한 손상의 경우 학생회의 판단에 따라 수리 비용을 부담할 수
                  있습니다.
                </li>
                <li>
                  심각한 손상이나 분실의 경우, 동일한 물품 또는 이에 상응하는
                  금액을 배상해야 할 수 있습니다.
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제6조 (서비스 이용 제한)
              </h2>
              <p className="text-gray-600">
                학생회는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수
                있습니다:
              </p>
              <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                <li>타인의 개인정보를 도용하거나 허위 정보를 제공한 경우</li>
                <li>물품을 고의로 손상시키거나 무단으로 반납하지 않은 경우</li>
                <li>반납 기한을 상습적으로 초과하는 경우</li>
                <li>기타 서비스 운영을 방해하는 행위를 한 경우</li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제7조 (면책 조항)
              </h2>
              <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                <li>
                  학생회는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등
                  불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 책임이
                  면제됩니다.
                </li>
                <li>
                  학생회는 회원의 귀책사유로 인한 서비스 이용 장애에 대해서는
                  책임을 지지 않습니다.
                </li>
                <li>
                  대여한 물품의 사용 중 발생한 안전사고에 대한 책임은 원칙적으로
                  회원에게 있습니다.
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제8조 (약관의 해석)
              </h2>
              <p className="text-gray-600">
                이 약관에 명시되지 않은 사항이나 해석에 관한 문제는 관련법령,
                학생회 규정 및 일반적인 관례에 따릅니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                제9조 (관할법원)
              </h2>
              <p className="text-gray-600">
                서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우
                부산지방법원을 전속 관할법원으로 합니다.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                본 약관은 2025년 5월 28일부터 시행합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
