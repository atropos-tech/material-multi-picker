import { AppleImage, PearImage, BananaImage, GrapesImage, MelonImage, RaspberryImage } from "./icons";

export const ALL_FRUITS = [
    { name: "apple", stock: 0, image: AppleImage, detail: "Keeps the doctor away" },
    { name: "pear", stock: 14, image: PearImage, detail: "The tastiest fruit in the world" },
    { name: "banana", stock: 282, image: BananaImage, detail: "Full of lovely potassium!" },
    { name: "melon", stock: 81, image: MelonImage, detail: "Available in many different flavours" },
    { name: "raspberry", stock: 422, image: RaspberryImage, detail: "Technically not a berry, but whatevs" },
    { name: "grapes", stock: 109, image: GrapesImage, detail: "You could theoretically make wine" }
];

export function getSuggestedFruitSync(searchString) {
    return ALL_FRUITS
        .filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()));
}


