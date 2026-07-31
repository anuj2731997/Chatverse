"use client";

import { useState } from "react";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function MessageInput({

    conversationId

}) {

    const [text, setText] = useState("");

    const send =
        useMutation(
            api.messages.send
        );

    async function handleSend() {

        if (!text.trim())
            return;

        await send({

            conversationId,

            body: text,

        });

        setText("");

    }

    return (

        <div className="flex gap-2">

            <input

                value={text}

                onChange={(e) =>

                    setText(
                        e.target.value
                    )

                }

                className="border flex-1 px-4 py-2"

            />

            <button
                onClick={handleSend}
            >

                Send

            </button>

        </div>

    )

}