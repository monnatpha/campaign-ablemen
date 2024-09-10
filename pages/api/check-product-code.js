import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { productCode } = req.query;

    try {
      const [result] = await db.query("CALL WRAS_Check_ProductCode(?)", [
        productCode,
      ]);

      res.status(200).json({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        result: {
          availableCode: result[0][0].availableCode,
          alreadyUsed: result[1][0].alreadyUsed,
        },
      });
    } catch (error) {
      await sendLarkFailed(error, "check-product-code");
      res.status(500).json({
        success: false,
        message: "ดึงข้อมูลไม่สำเร็จ (10001)",
        result: "",
      });
    }
  } else {
    await sendLarkFailed(
      { error: "ดึงข้อมูลไม่สำเร็จ (10002)" },
      "check-product-code"
    );
    res.status(405).json({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ (10002)",
      result: "",
    });
  }
}
