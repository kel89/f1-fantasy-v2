import { useState, useEffect, ReactElement } from "react";

// Helper function to get the image element based on the string
const getImageElement = async (imageName: string, imageClasses: string) => {
    try {
        const imageSrc = await import(imageName);
        return (
            <img
                className={imageClasses}
                src={imageSrc.default}
                alt={imageName}
            />
        );
    } catch (error) {
        return <p>Image not found</p>;
    }
};

// Example component using the helper function
const ImageComponent = ({
    imageName,
    imageClasses = "inline-block h-16 w-16",
}: {
    imageName: string;
    imageClasses?: string;
}) => {
    const [imageElement, setImageElement] = useState<ReactElement | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            const element = await getImageElement(imageName, imageClasses);
            setImageElement(element);
        };

        fetchImage();
    }, [imageName]);

    return <div>{imageElement}</div>;
};

export default ImageComponent;
