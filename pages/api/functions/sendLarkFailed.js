export const sendLarkFailed = async (obj, url) => {
  const { title, message } = await createMessageMediaSalesLark(
    obj,
    "Error",
    url
  );
  const card = await createCardMedia(title, message);
  await postLark(process.env.LARK_FAILED, card);
};

export const createMessageMediaSalesLark = async (obj, headMsg, url) => {
  const title = `🛎 ${headMsg} 🛎`;
  const message = `🏷  url: ${url}  
  🚫 code: ${obj.code}
  📛 error: ${obj.error}
  ⛔️ sql: ${obj.sql}
  💢 sqlState: ${obj.sqlState}
  🆘 sqlMessage: ${obj.sqlMessage}`;
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
