import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { storeCode } = req.query;

    try {
      const [result] = await db.query("CALL WRAS_Check_StoreCode(?)", [
        storeCode,
      ]);

      res.status(200).json({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        result: result[0][0],
      });
    } catch (error) {
      await sendLarkFailed(error, "check-store-code");
      res.status(500).json({
        success: false,
        message: "ดึงข้อมูลไม่สำเร็จ (10003)",
        result: "",
      });
    }
  } else {
    await sendLarkFailed(
      { error: "ดึงข้อมูลไม่สำเร็จ (10004)" },
      "check-store-code"
    );
    res.status(405).json({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ (10004)",
      result: "",
    });
  }
}
