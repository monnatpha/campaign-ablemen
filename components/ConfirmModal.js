import React from "react";

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4 text-center">
          <span className="block mb-2">
            !!! กรุณาตรวจสอบข้อมูลให้เรียบร้อยก่อนลงทะเบียน
          </span>
          <span className="block text-sm font-normal">
            เช่นรหัสร้านค้า
            เนื่องจากถ้ากรอกรหัสร้านค้าผิดจะทำให้คุณเสียสิทธิ์ในการรับของรางวัล
          </span>
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
