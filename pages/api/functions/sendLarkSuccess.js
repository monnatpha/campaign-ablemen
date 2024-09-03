export const sendLarkSuccess = async (obj) => {
  const { title, message } = await createMessageMediaSalesLark(
    obj,
    "ลงทะเบียนสำเร็จ"
  );
  const card = await createCardMedia(title, message);
  await postLark(process.env.LARK_SUCESS, card);
};

export const createMessageMediaSalesLark = async (obj, headMsg) => {
  const {
    acceptPDPA,
    agentStore,
    fullName,
    mobileModel,
    phoneNumber,
    productCategory,
    productQR,
    purchaseChannel,
    storeQR,
    userLineId,
  } = obj;

  const title = `🟢🎉🎈🎊 ${headMsg} 🎊🎈🎉 🟢`;
  const message = `🆔 รหัสไลน์: ${userLineId}
🪪 ข้อมูลผู้ใช้
ชื่อ-นามสกุล: ${fullName}
เบอร์โทรศัพท์: ${phoneNumber}

📦 ข้อมูลสินค้า
รหัสสินค้า: ${productQR}
ประเภทสินค้า: ${productCategory}
รุ่นมือถือ: ${mobileModel}

🏠 ข้อมูลร้านค้า
ช่องทางการสั่งซื้อ: ${purchaseChannel}
ร้านค้าตัวแทนจำหน่าย: ${agentStore}
รหัสร้านค้า: ${storeQR}

📝 ยอมรับเงื่อนไข PDPA: ${acceptPDPA}`;
  return { title, message };
};

export const createCardMedia = async (title, message) => {
  const elements = [
    {
      tag: "div",
      text: {
        tag: "plain_text",
        content: message,
      },
    },
    {
      tag: "hr",
    },
  ];

  return {
    msg_type: "interactive",
    card: {
      config: {
        wide_screen_mode: true,
        enable_forward: true,
      },
      header: {
        title: {
          tag: "plain_text",
          content: title,
        },
      },
      elements,
    },
  };
};

export const postLark = async (url, card) => {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
      mode: "no-cors",
    });
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
};
