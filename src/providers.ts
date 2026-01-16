export interface Provider {
    dev?: boolean;
    name: string;
    title: string;
    scheme: string;
    domain: string;
    port?: number;
    controller: string;
}

const PROVIDERS: Provider[] = [
    {
        name: "moera.blog",
        title: "Moera.Blog",
        scheme: "https",
        domain: "moera.blog",
        controller: "https://lamed.moera.blog"
    },
    {
        name: "moera.club",
        title: "Moera.Club",
        scheme: "https",
        domain: "moera.club",
        controller: "https://toshick.moera.club"
    },
    {
        dev: true,
        name: "local",
        title: "Local",
        scheme: "https",
        domain: "localhost.localdomain",
        port: 8082,
        controller: "https://balu-dev.localhost.localdomain:8082"
    }
];

export default PROVIDERS;
