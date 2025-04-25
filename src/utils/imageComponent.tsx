import { useState, useEffect, ReactElement } from "react";
import Alb from "../../assets/drivers/alb.png";
import Alo from "../../assets/drivers/alo.png";
import Bot from "../../assets/drivers/bot.png";
import Gas from "../../assets/drivers/gas.png";
import Ham from "../../assets/drivers/ham.png";
import Hul from "../../assets/drivers/hul.png";
import Lec from "../../assets/drivers/lec.png";
import Mag from "../../assets/drivers/mag.png";
import Nor from "../../assets/drivers/nor.png";
import Oco from "../../assets/drivers/oco.png";
import Per from "../../assets/drivers/per.png";
import Pias from "../../assets/drivers/pias.png";
import Ric from "../../assets/drivers/ric.png";
import Rus from "../../assets/drivers/rus.png";
import Sai from "../../assets/drivers/sai.png";
import Sar from "../../assets/drivers/sar.png";
import Str from "../../assets/drivers/str.png";
import Tsu from "../../assets/drivers/tsu.png";
import Ver from "../../assets/drivers/ver.png";
import Zhou from "../../assets/drivers/zhou.png";

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
