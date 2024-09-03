import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 1,
  duration: "1s",
};

const BASE_URL = "http://localhost:3000";

function getRequest(endpoint) {
  return http.get(`${BASE_URL}${endpoint}`);
}

function postRequest(endpoint, payload, params) {
  return http.post(`${BASE_URL}${endpoint}`, payload, params);
}

function checkGetResponse(response) {
  check(response, {
    "is status 200": (r) => r.status === 200,
    "response get time < 200ms": (r) => r.timings.duration < 200,
    "response get contains result": (r) => r.json().hasOwnProperty("result"),
  });
}

function checkPostResponse(response) {
  check(response, {
    "is status post 201": (r) => r.status === 201,
    "response post time < 500ms": (r) => r.timings.duration < 500,
  });
}

export default function () {
  const productCode = "DjFkPAFK3r9";

  const res1 = getRequest("/api/get-model");
  const res2 = getRequest("/api/get-purchase-channel");
  const res3 = getRequest("/api/get-agent-store");
  const res4 = getRequest("/api/get-product-category");
  const res5 = getRequest(
    `/api/check-product-code?productCode=${encodeURIComponent(productCode)}`
  );

  checkGetResponse(res1);
  checkGetResponse(res2);
  checkGetResponse(res3);
  checkGetResponse(res4);
  checkGetResponse(res5);

  const result2 = res5.json("result");
  console.log(result2);

  const payload = JSON.stringify({
    fullName: "มนต์ณัฐ พันธุ์ชัยพล",
    phoneNumber: "20202020",
    purchaseChannel: "ร้านค้าตัวแทนจำหน่าย",
    productQR: "kkkk",
    agentStore: "TG Fone",
    storeQR: "TUP-NMI-01-0002",
    productCategory: "1. กระจกกันรอยเต็มจอแบบด้าน เฉพาะรุ่น iphone เท่านั้น",
    mobileModel: "iPhone 7",
    acceptPDPA: true,
    userLineId: "Uf91357ffb45b51c14826s92fa",
  });

  const postParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const postResponse = postRequest("/api/insert", payload, postParams);
  checkPostResponse(postResponse);

  const customerNo = "TUP-NMI-01-0002";
  const summaryUrl = `/api/get-summary-register?customerNo=${encodeURIComponent(
    customerNo
  )}`;
  const summaryResponse = getRequest(summaryUrl);
  const result = summaryResponse.json("result");

  console.log("Result:", JSON.stringify(result));

  sleep(1);
}
