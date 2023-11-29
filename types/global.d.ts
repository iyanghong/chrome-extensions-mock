import type {
    VNodeChild,
    PropType as VuePropType,
} from 'vue';
declare global {
    declare type Nullable<T> = T | null;
    declare type VueNode = VNodeChild | JSX.Element;
    declare type PropType<T> = VuePropType<T>;
    declare interface ChangeEvent extends Event {
        target: HTMLInputElement;
    }

    declare interface WheelEvent {
        path?: EventTarget[];
    }
}