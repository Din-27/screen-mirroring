import React, { useState, useEffect } from "react";
import { socket } from "../config/socket";

const Mirroring = () => {
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    function onFooEvent(value) {
      const blob = new Blob([value], { type: "image/png" });
      const urlImg = URL.createObjectURL(blob); // Membuat URL dari Blob
      setBuffer(urlImg);
      socket.emit("finish", true);
    }

    socket.on("buffer", onFooEvent);
    
    return () => {
      socket.off("buffer", onFooEvent);
    };
  }, [buffer]);

  return (
    <div className="flex justify-evenly h-screen py-24">
      <img
        src={buffer}
        width={250} // Sesuaikan ukuran canvas sesuai kebutuhan
        height={400} // Sesuaikan ukuran canvas sesuai kebutuhan
        style={{ border: "1px solid black" }}
        alt=""
      />
      {/* <video ref={videoRef} autoPlay controls style={{ width: "100%" }} /> */}
    </div>
  );
};

export default Mirroring;
