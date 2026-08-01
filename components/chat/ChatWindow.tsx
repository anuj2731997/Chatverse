"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

interface Props {
    conversationId: Id<"conversations">;
}

export default function ChatWindow({

    conversationId

}: Props) {

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