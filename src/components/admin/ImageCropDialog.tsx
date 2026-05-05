import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Loader2, X, Save, RotateCw } from "lucide-react";

interface Props {
  open: boolean;
  imageSrc: string | null;
  onCancel: () => void;
  onSave: (blob: Blob) => Promise<void> | void;
}

const ASPECTS = [
  { label: "Square 1:1", value: 1 },
  { label: "Landscape 4:3", value: 4 / 3 },
  { label: "Wide 16:9", value: 16 / 9 },
  { label: "Portrait 3:4", value: 3 / 4 },
  { label: "Free", value: 0 },
];

const OUTPUT_SIZES = [512, 800, 1024, 1600];

async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number,
  rotation: number,
  quality: number
): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => res(image);
    image.onerror = rej;
    image.src = imageSrc;
  });

  const radians = (rotation * Math.PI) / 180;

  // Step 1: rotate full image onto a canvas
  const rotCanvas = document.createElement("canvas");
  const rCtx = rotCanvas.getContext("2d")!;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  rotCanvas.width = img.width * cos + img.height * sin;
  rotCanvas.height = img.width * sin + img.height * cos;
  rCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
  rCtx.rotate(radians);
  rCtx.drawImage(img, -img.width / 2, -img.height / 2);

  // Step 2: crop from rotated canvas
  const cropCanvas = document.createElement("canvas");
  const cCtx = cropCanvas.getContext("2d")!;
  const scale = outputWidth / pixelCrop.width;
  cropCanvas.width = outputWidth;
  cropCanvas.height = Math.round(pixelCrop.height * scale);
  cCtx.drawImage(
    rotCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height
  );

  return await new Promise<Blob>((res) =>
    cropCanvas.toBlob((b) => res(b!), "image/jpeg", quality)
  );
}

const ImageCropDialog = ({ open, imageSrc, onCancel, onSave }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number>(1);
  const [outputWidth, setOutputWidth] = useState(1024);
  const [quality, setQuality] = useState(0.9);
  const [pixelCrop, setPixelCrop] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setPixelCrop(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !pixelCrop) return;
    setSaving(true);
    try {
      const blob = await getCroppedBlob(imageSrc, pixelCrop, outputWidth, rotation, quality);
      await onSave(blob);
    } finally {
      setSaving(false);
    }
  };

  if (!open || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-primary/20 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <h3 className="text-lg font-bold text-foreground">Crop & Resize Image</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative bg-muted h-[55vh]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect === 0 ? undefined : aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            restrictPosition={false}
          />
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Aspect ratio</label>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => setAspect(a.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    aspect === a.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/20 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Output width</label>
            <div className="flex flex-wrap gap-2">
              {OUTPUT_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setOutputWidth(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    outputWidth === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/20 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Zoom ({zoom.toFixed(2)}×)
            </label>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Quality ({Math.round(quality * 100)}%)
            </label>
            <input
              type="range"
              min={0.4}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-3 py-2 border border-primary/20 rounded-lg text-foreground text-sm font-semibold hover:bg-muted flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" /> Rotate 90°
            </button>
            <button
              onClick={() => {
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setRotation(0);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-primary/20">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-primary/20 rounded-lg text-foreground font-semibold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !pixelCrop}
            className="px-5 py-2.5 gradient-primary text-primary-foreground font-bold rounded-lg glow-primary hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropDialog;
