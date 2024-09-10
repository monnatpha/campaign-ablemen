import { useRouter } from "next/router";
const Register = (props) => {
  const router = useRouter();
  const handleOnclick = () => {
    router.push("https://liff.line.me/1656638120-EwmG04Md");
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <div className="mb-2">
        <p>ลงทะเบียนเรียบร้อยแล้ว</p>
        <p>กรุณาแสดงหน้าจอนี้กับทางร้านเพื่อรับ</p>
        <p>ของพรีเมียมจากทางร้านค้าค่ะ</p>
      </div>
      <div className="mb-4">
        <p> ขอบคุณที่เลือกติด</p>
        <p> กระจกกันรอยเอเบิลเม็นค่ะ</p>
      </div>
      <button
        onClick={() => handleOnclick()}
        className="w-4/5 bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ fontSize: "1rem" }}
      >
        ลงทะเบียนรับประกันสินค้า
      </button>
    </div>
  );
};

export default Register;
