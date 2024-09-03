import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import store from "../redux/store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  function getMobileOperatingSystem() {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent || window.opera;

      if (/android/i.test(userAgent)) {
        return "Android";
      }

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
      }

      return "unknown";
    }

    return "unknown";
  }

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   import("vconsole").then((VConsole) => {
    //     new VConsole.default();
    //   });
    // }
    console.log("start liff.init()...");
    liff
      .init({ liffId: process.env.LIFF_ID })
      .then(() => {
        console.log("liff.init() done");

        liff.ready.then(() => {
          console.log("liff.ready() done");
          setLiffObject(liff);
        });
      })
      .catch((error) => {
        console.log(`liff.init() failed: ${error}`);
        if (!process.env.liffId) {
          console.info(
            "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
          );
        }
        setLiffError(error.toString());
      });
  }, []);

  pageProps.liff = liffObject;
  pageProps.liffError = liffError;

  return (
    <Provider store={store}>
      <Component {...pageProps} /> <ToastContainer />
    </Provider>
  );
}

export default MyApp;
