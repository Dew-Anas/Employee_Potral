import { useRef, useState } from "react";

const CustomerSignoff = ({ onSign }) => {
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const clientX =
      event.touches?.[0]?.clientX ?? event.clientX;

    const clientY =
      event.touches?.[0]?.clientY ?? event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const { x, y } = getCanvasCoordinates(event);

    context.beginPath();
    context.moveTo(x, y);

    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const { x, y } = getCanvasCoordinates(event);

    context.lineTo(x, y);
    context.strokeStyle = "#0F172A";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.stroke();

    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    setHasSignature(false);
  };

  const handleConfirm = () => {
    if (!hasSignature) {
      alert("Please provide customer signature.");
      return;
    }

    const canvas = canvasRef.current;
    const signature = canvas.toDataURL("image/png");

    onSign?.(signature);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Customer Sign-off
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Ask the customer to sign below to confirm that
          the service has been completed.
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-300 bg-white">
        <canvas
          ref={canvasRef}
          width={700}
          height={250}
          className="h-52 w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={clearSignature}
          className="flex-1 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear Signature
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Confirm Sign-off
        </button>
      </div>
    </div>
  );
};

export default CustomerSignoff;