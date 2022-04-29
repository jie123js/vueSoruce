declare module 'jquery' {
    function $(): {
        css(key: string, value: string): void
    }
    namespace $ {
        export namespace fn {
            function extend() {

            }
        }
    }
    export default $
}

declare function $(): {
    css(key: string, value: string): void
}
declare namespace $ {
    export namespace fn {
        function extend() {

        }
    }
}
declare interface X {
    a: string
}
declare module '*.png'
declare interface String {
    xxx(): void
}
declare interface Window {
    store: string
}
declare enum Role {
    user,
    admin
}
declare module '*.vue' {
    let component: any
    export default component
}

