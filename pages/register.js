import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCheck } from "../redux/checkSlice";
const Register = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleOnclick = () => {
    dispatch(setCheck(1));
    router.push("/");
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Ablemen</h1>
      <div className="mb-2">
        <p> กรุณารอสักครู่ ทางร้านกําลัง</p>
        <p> เตรี่ยมของพรีเมียมมอบให้ท่าน</p>
      </div>
      <div className="mb-4">
        <p> ขอบคุณที่เลือกติด</p>
        <p> กระจกกันรอยเอเบิลเม็นค่ะ</p>
      </div>
      <button
        onClick={() => handleOnclick()}
        className="w-full bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{ fontSize: "1rem" }}
      >
        ลงทะเบียนรับประกันสินค้า
      </button>
    </div>
  );
};

export default Register;
