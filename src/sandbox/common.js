import { AppleImage, PearImage, BananaImage, GrapesImage, MelonImage, RaspberryImage, PomegranateImage, WatermelonImage, CitrusImage, PlumImage, TomatoImage } from "./icons";

export const ALL_FRUITS = [
    { name: "apple", stock: 0, image: AppleImage, detail: "Keeps the doctor away" },
    { name: "pear", stock: 14, image: PearImage, detail: "The tastiest fruit in the world" },
    { name: "banana", stock: 282, image: BananaImage, detail: "Full of lovely potassium!" },
    { name: "melon", stock: 81, image: MelonImage, detail: "Available in many different flavours" },
    { name: "raspberry", stock: 422, image: RaspberryImage, detail: "Technically not a berry, but whatevs" },
    { name: "grapes", stock: 109, image: GrapesImage, detail: "You could theoretically make wine" },
    { name: "pomegranate", stock: 75, image: PomegranateImage, detail: "No-one knows what these are" },
    { name: "tomato", stock: 5, image: TomatoImage, detail: "This is definitely a fruit, get off my case" },
    { name: "lemon", stock: 75, image: CitrusImage, detail: "When life give you lemons, something something grenade" },
    { name: "plum", stock: 2, image: PlumImage, detail: "Not as good as a nectarine, deal with it" },
    { name: "watermelon", stock: 1045, image: WatermelonImage, detail: "Soooo refreshing on a hot day" },

];

export function getSuggestedFruitSync(searchString) {
    return ALL_FRUITS
        .filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()));
}


