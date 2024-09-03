import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";

export default function Home(props) {
  if (!props?.liff?.isLoggedIn()) {
    props?.liff?.login();
  }

  const router = useRouter();
  const [formData, setFormData] = useState({
    productQR: "",
  });
  const check = useSelector((state) => state.check);
  const url = "https://www.focusshield.com/submit-warranty/?fw=DjFkPAFK3r9";
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
    url
  )}&size=200`;

  const handleBlur = async (value) => {
    if (value) {
      try {
        const response = await fetch(
          `/api/check-product-code?productCode=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        const availableCode = data.result.availableCode;
        const alreadyUsed = data.result.alreadyUsed;

        if (availableCode === 0) {
          toast.warn("Product Code ไม่มีในระบบ");
          setFormData((prevData) => ({
            ...prevData,
            productQR: "",
          }));
          return;
        }

        if (alreadyUsed === 0) {
          toast.success("Product Code สามารถใช้งานได้");
          router.push("/register");
        } else {
          toast.warn("Product Code นี้ถูกใช้งานแล้ว");
          setFormData((prevData) => ({
            ...prevData,
            productQR: "",
          }));
          return;
        }
      } catch (error) {
        console.log(error, "error");
        toast.error("ตรวจสอบ Product Code ไม่สำเร็จ");
      }
    }
  };

  const handleScanQR = async (type) => {
    liff
      .scanCodeV2()
      .then(async (result) => {
        try {
          const urlObj = new URL(result.value);
          const params = new URLSearchParams(urlObj.search);
          const key = type === "รหัสสินค้า" ? "fw" : "customerNo";
          const value = params.get(key);

          if (!value) {
            toast.error("ไม่พบข้อมูลใน QR Code");
            return;
          }

          setFormData((prevData) => ({
            ...prevData,
            [type === "รหัสสินค้า" ? "productQR" : "storeQR"]: value,
          }));
          if (type === "รหัสสินค้า") {
            await handleBlur(value, type);
          }
          if (type === "รหัสร้านค้า") {
            toast.success("QR Code สามารถใช้งานได้");
          }
        } catch (error) {
          toast.warn("QR Code ไม่ถูกต้อง");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Ablemen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputProductCode
          label=""
          name="productQR"
          type="text"
          value={formData.productQR}
          onChange={handleChange}
          required
          placeholder="กรอกรหัสสินค้าหรือกดปุ่มสแกน QR Code ด้านล่าง"
          onBlur={handleBlur}
        />
        <Button
          onClick={() => handleScanQR("รหัสสินค้า")}
          text="สแกนรหัสสินค้า"
          type="button"
        />
      </form>
      {check === 1 && (
        <div className="mb-2 mt-6 text-center">
          <p> กรุณารอสักครู่ ทางร้านกําลัง</p>
          <p> เตรี่ยมของพรีเมียมมอบให้ท่าน</p>
          <div className="flex items-center justify-center">
            <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
          </div>
        </div>
      )}
    </div>
  );
}
const InputProductCode = ({ label, onBlur, ...props }) => {
  return (
    <div>
      <p className="text-center">
        กรุณากรอกรหัสสินค้า หรือ สแกน QR Code สินค้า
      </p>
      <div className="text-center">
        <a
          href="https://focusshield.com/iphone-16/lucky-draw-premium"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          รายละเอียดและเงื่อนไขรับของพรีเมียม
        </a>
      </div>

      <input
        {...props}
        onBlur={(e) => onBlur(e.target.value)}
        className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ fontSize: "1rem" }}
      />
    </div>
  );
};

const Button = ({ text, ...props }) => (
  <button
    {...props}
    className="w-full bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    style={{ fontSize: "1rem" }}
  >
    {text}
  </button>
);
