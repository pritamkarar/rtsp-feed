"use client";

import { usePaths } from "@/hooks/useMediamtx";

export default function ActiveStreams() {
    const { data, isLoading, error } = usePaths();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading streams</p>;

    return (
        <ul>
            {data?.items.map((item) => (
                <li key={item.name}>
                    {item.name} — {item.ready ? "Ready" : "Not Ready"}
                </li>
            ))}
        </ul>
    );
}
