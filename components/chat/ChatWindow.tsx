"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function ChatWindow({

    conversationId

}) {

    const messages =
        useQuery(
            api.messages.list,
            { conversationId }
        );

    if (!messages)
        return <p>Loading...</p>;

    return (

        <div>

            {
                messages.map(msg => (

                    <div
                        key={msg._id}
                        className="mb-4"
                    >

                        <div
                            className="font-semibold"
                        >

                            {msg.sender?.name}

                        </div>

                        <div>

                            {msg.body}

                        </div>

                    </div>

                ))
            }

        </div>

    )

}