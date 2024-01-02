import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonType } from "./button-type";

export class Button {
    public constructor(
        public readonly action: () => void,
        public readonly title?: string,
        public readonly icon?: IconDefinition,
        public readonly type: ButtonType = ButtonType.primary,
    ) { }
}