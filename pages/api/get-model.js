import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [result] = await db.query("CALL WRAS_Option_Model");
      res.status(200).json({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        result: { items: result[0] },
      });
    } catch (error) {
      await sendLarkFailed(error, "get-model");
      res.status(500).json({
        success: false,
        message: "ดึงข้อมูลไม่สำเร็จ (10009)",
        result: "",
      });
    }
  } else {
    await sendLarkFailed({ error: "ดึงข้อมูลไม่สำเร็จ (10010)" }, "get-model");
    res.status(405).json({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ (10010)",
      result: "",
    });
  }
}
