const PROVIDERS = [
    {
        name: "moera.blog",
        title: "Moera.Blog",
        scheme: "https",
        domain: "moera.blog",
        controller: "https://lamed.moera.blog"
    },
    {
        dev: true,
        name: "local",
        title: "Local",
        scheme: "http",
        domain: "localhost.localdomain",
        port: 8082,
        controller: "http://localhost.localdomain:8082"
    }
];

export default PROVIDERS;
