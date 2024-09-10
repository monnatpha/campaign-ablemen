import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import { useRouter } from "next/router";
const Register = (props) => {
  const router = useRouter();
  const [options, setOptions] = useState({
    mobileModel: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkQR, setCheckQR] = useState(1);
  const [btnDisable, setBtnDisable] = useState(false);

  const fetchOptions = async (endpoint, optionName) => {
    try {
      const response = await fetch(`/campaign/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${optionName}`);
      }
      const data = await response.json();

      setOptions((prevOptions) => ({
        ...prevOptions,
        [optionName]: data.result.items,
      }));
    } catch (error) {
      console.error(`Error fetching ${optionName}:`, error);
    }
  };

  useEffect(() => {
    const fetchAllOptions = async () => {
      await Promise.all([fetchOptions("get-model", "mobileModel")]);
      setLoading(false);
    };
    fetchAllOptions();
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    mobileModel: "",
    productQR: "",
    storeQR: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (checkQR === 0) {
      setBtnDisable(true);

      const { phoneNumber, ...rest } = formData;
      const formattedPhoneNumber = phoneNumber.replace(/-/g, "");
      setIsModalOpen(false);

      try {
        const response = await fetch("/campaign/api/insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...rest,
            phoneNumber: formattedPhoneNumber,
            userLineId: "liff.getContext().userId",
          }),
        });

        const data = await response.json();

        if (data.error) {
          console.log(data.error, "");
          toast.error("ลงทะเบียนไม่สำเร็จ");
          setBtnDisable(false);
          return;
        }
        // await liff.sendMessages([
        //   {
        //     type: "text",
        //     text: "ลงทะเบียนสำเร็จ",
        //   },
        // ]);
        await toast.success("ลงทะเบียนสำเร็จ");
        setBtnDisable(false);
        router.push("/register");
        setLoading(true);
      } catch (error) {
        toast.error("ลงทะเบียนไม่สำเร็จ");
      }
    } else {
      toast.error("โปรดตรวจสอบรหัสสินค้า");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

  const handleBlur = async (value, name) => {
    if (name === "รหัสสินค้า") await checkProdctCode(value);
    if (name === "รหัสร้านค้า") await checkStoreCode(value);
  };

  const checkProdctCode = async (value) => {
    if (value) {
      try {
        const response = await fetch(
          `/campaign/api/check-product-code?productCode=${encodeURIComponent(
            value
          )}`
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
        setCheckQR(alreadyUsed);
        if (alreadyUsed === 0) {
          toast.success("Product Code สามารถใช้งานได้");
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
  const checkStoreCode = async (value) => {
    if (value) {
      try {
        const response = await fetch(
          `/campaign/api/check-store-code?storeCode=${encodeURIComponent(
            value
          )}`
        );
        const data = await response.json();
        const check = data.result.count;

        if (check === 0) {
          toast.success("Store Code สามารถใช้งานได้");
        } else {
          toast.warn("Store Code นี้ถูกใช้งานแล้ว");
          setFormData((prevData) => ({
            ...prevData,
            storeQR: "",
          }));
        }
      } catch (error) {
        toast.error("ตรวจสอบ Store Code ไม่สำเร็จ");
      }
    }
  };

  if (loading || btnDisable) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg space-y-4 min-h-screen">
      <div className="flex flex-col items-center justify-center ">
        <p>กรุณากรอกข้อมูลให้ถูกต้อง ครบถ้วน</p>
        <a
          href="https://focusshield.com/iphone-16/lucky-draw-premium"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline "
        >
          รายละเอียดและเงื่อนไขรับของพรีเมี่ยม
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="ชื่อ-นามสกุล"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="กรอกชื่อ-นามสกุล"
          required
        />
        <InputField
          label="เบอร์โทรศัพท์"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          placeholder="0xx-xxx-xxxx"
          maxLength={10}
          minLength={10}
        />
        <SelectField
          label="รุ่นมือถือ"
          name="mobileModel"
          options={options.mobileModel}
          value={formData.mobileModel}
          onChange={handleChange}
          required
        />
        <InputProductCode
          label="รหัสสินค้า"
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
          text="สแกน QR Code"
          type="button"
        />
        <InputStoreCode
          label="รหัสร้านค้า"
          name="storeQR"
          type="text"
          value={formData.storeQR}
          onChange={handleChange}
          required
          placeholder="กรอกรหัสร้านค้าหรือกดปุ่มสแกน QR Code ด้านล่าง"
        />
        <Button
          onClick={() => handleScanQR("รหัสร้านค้า")}
          text="สแกน QR Code"
          type="button"
        />
        <ButtonConfirm type="submit" text="ตกลง" disabled={btnDisable} />
        <ConfirmModal
          isOpen={isModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-lg font-medium mb-2">
      {label}
      <span className="text-red-500"> *</span>
      <input
        {...props}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-orange-200	border-0.5"
        style={{ fontSize: "1rem" }}
      />
    </label>
  </div>
);

const InputStoreCode = ({ label, ...props }) => {
  const storeCodePattern = "^[A-Z]{3}-[A-Z]{3}-[0-9]{2}-[0-9]{4}$";

  return (
    <div>
      <label className="block text-lg font-medium">
        {label}
        <span className="text-red-500"> *</span>
        <input
          {...props}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-orange-200	border-0.5"
          style={{ fontSize: "1rem" }}
          pattern={storeCodePattern}
          title="รหัสร้านค้าไม่ถูกต้อง TTT-TTT-XX-XXXX (T: ตัวหนังสือพิมพ์ใหญ่, X: ตัวเลข)"
        />
      </label>
    </div>
  );
};

const InputProductCode = ({ label, onBlur, ...props }) => {
  return (
    <div>
      <label className="block text-lg font-medium">
        {label}
        <span className="text-red-500"> *</span>
        <input
          {...props}
          onBlur={(e) => onBlur(e.target.value, label)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-orange-200	border-0.5"
          style={{ fontSize: "1rem" }}
        />
      </label>
    </div>
  );
};

const SelectField = ({ label, options, ...props }) => {
  return (
    <div>
      <label className="block text-lg font-medium mb-2">
        {label}
        <span className="text-red-500"> *</span>
        <select
          {...props}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-orange-200	border-0.5"
          style={{ fontSize: "1rem" }}
        >
          <option value="" disabled selected>
            เลือก
          </option>
          {options.map((item) => (
            <option key={item.id} value={item.id} disabled={item?.disabled}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

const Button = ({ text, ...props }) => (
  <button
    {...props}
    className="w-full bg-orange-400	 hover:bg-orange-500	 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    style={{ fontSize: "1rem" }}
  >
    {text}
  </button>
);

const ButtonConfirm = ({ text, ...props }) => (
  <div className="flex flex-col items-center ">
    <button
      {...props}
      className="w-2/5 m-4 bg-orange-400	hover:bg-orange-500	 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      style={{ fontSize: "1rem" }}
    >
      {text}
    </button>
  </div>
);
export default Register;
