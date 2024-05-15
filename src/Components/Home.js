import React, { useState, useRef, useEffect } from "react";

const Home = () => {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(16);
  const [fontStyle, setFontStyle] = useState("Arial");
  const [displayText, setDisplayText] = useState("Your Signature");
  const [isSigning, setIsSigning] = useState(false);

  const canvasRef = useRef(null);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [bgColor]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigning(false);
    setDisplayText("");
  };
  const handleTextDownload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    context.fillStyle = textColor;
    context.font = `${fontSize}px ${fontStyle}`;

    // Measure the text's width
    const textWidth = context.measureText(displayText).width;

    // Calculate the x-coordinate to center the text
    const x = (width - textWidth) / 2;

    // Calculate the y-coordinate to center the text
    const y = height / 2;

    // Draw the text at the calculated coordinates
    context.fillText(displayText, x, y);

    const dataURL = canvas.toDataURL("image/png");
    const element = document.createElement("a");
    element.href = dataURL;
    element.download = "text.png";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveDownload = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const element = document.createElement("a");
    element.href = dataURL;
    element.download = "signature.png";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.strokeStyle = textColor;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(prevPosRef.current.x, prevPosRef.current.y);
    context.lineTo(x, y);
    context.stroke();

    prevPosRef.current = { x, y };
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    prevPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    drawingRef.current = true;
    setIsSigning(true);
  };

  const handleMouseMove = (e) => {
    if (drawingRef.current) {
      draw(e);
    }
  };

  const handleMouseUp = () => {
    drawingRef.current = false;
    setIsSigning(false);
  };

  const handleMouseOut = () => {
    drawingRef.current = false;
    setIsSigning(false);
  };

  return (
    <div className="border h-screen bg-stone-100">
      <div className="  p-10 text-center">
        <div className=" grid grid-cols-4 gap-20">
          <div className="">
            <h1 className="">Text color picker</h1>
            <div className="border border-black p-1 mt-1">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full "
              />
            </div>
            <div></div>
          </div>
          <div>
            <h1 className="">Background</h1>
            <div className="border border-black mt-1 p-1">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                }}
                className="w-full"
              />
            </div>
          </div>
          <div>
            <h1 className="">Font Size</h1>
            <div className="border border-black mt-1">
              <input
                type="number"
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                }}
                className="w-full p-1"
              />
            </div>
          </div>
          <div>
            <h1>Font Style</h1>
            <div className="border border-black mt-1">
              <select
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value)}
                className="w-full p-1"
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="cursive">Cursive</option>
                <option value="Brush Script MT">Brush Script MT</option>
                <option value="Lucida Handwriting">Lucida Handwriting</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
            </div>
          </div>
        </div>
        <div className=" mt-5 h-[450px] grid grid-cols-2 items-center justify-center border border-black">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            style={{
              backgroundColor: bgColor,
              cursor: isSigning ? "crosshair" : "default",
              border: "1px solid black",
              marginLeft: "100px",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}
          ></canvas>

          <h1
            className="text-4xl border border-black  h-[200px] w-[600px] "
            style={{
              color: textColor,
              backgroundColor: bgColor,
              fontSize: `${fontSize}px`,
              fontFamily: fontStyle,
            }}
          >
            {displayText}
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-20 mt-5">
          <h1 className="bg-green-500 py-1" onClick={handleSaveDownload}>
            Download Drawn Sign
          </h1>
          <h1 className="bg-red-500 py-1" onClick={handleClear}>
            Clear
          </h1>

          <h1 className="bg-yellow-500 py-1">
            Write Text Sign
            <input
              type="text"
              onChange={(e) => {
                setDisplayText(e.target.value);
              }}
              style={{ marginLeft: "5px", padding: "2px" }}
            />
          </h1>
          <h1 className="bg-green-500 py-1" onClick={handleTextDownload}>
            Download Text Sign
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
