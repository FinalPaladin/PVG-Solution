import "./image.css"
import { useEffect, useState, type JSX } from "react";

type ImageControlProps = {
    imageKey: string;
    img: string;
    isUpload: boolean;
    onImageChange?: (img: File | null, url: string | null) => void;
};

export default function ImageControl(props: ImageControlProps): JSX.Element {
    const { imageKey, img, isUpload, onImageChange } = props;
    const [localImage, setLocalImage] = useState<string | null>(null);
    const imgId = `imageinput_${imageKey}`;

    // reset state khi prop img thay đổi
    useEffect(() => {
        setLocalImage(null);
    }, [img]);

    const displayImage = localImage ?? img; // ưu tiên ảnh vừa upload, fallback img từ prop

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLocalImage(url);
            onImageChange?.(file, url);
        }
    };

    return (
        <>
            <div
                className="image-upload-box"
                onClick={() => document.getElementById(imgId)?.click()}
            >
                {!displayImage && isUpload && (
                    <div className="upload-placeholder">
                        <span className="plus">+</span>
                        Upload Image
                    </div>
                )}
                {displayImage && <img src={displayImage} alt="preview" className="preview-image" />}
                {displayImage && <div className="overlay">Change</div>}
            </div>

            <input
                type="file"
                id={imgId}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUpload}
            />
        </>
    );
}