import { component$ } from "@builder.io/qwik";

const routes = [
    {
        path: "/",
        name: "Image Edit",
    }
];

export const Nav = component$(() => {
    return (
        <nav class="flex justify-between border-b border-slate-700 bg-slate-800">
            <ul class="flex">
                {routes.map((route, index) => (
                    <li key={index} class="border-b-2 border-slate-500">
                        <a class="block py-3 px-2 text-slate-50 hover:bg-slate-400" href={route.path}>{route.name}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
});
