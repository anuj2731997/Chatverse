"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { CornerUpLeft } from "lucide-react";

interface Props {
    isMine: boolean;
    onReply: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function MessageActions({
    isMine,
    onReply,
    onEdit,
    onDelete,
}: Props) {




    return (

        <DropdownMenu>
            <DropdownMenuTrigger
                className="
    inline-flex
    h-7
    w-7
    items-center
    justify-center
    rounded-md
    hover:bg-accent
  "
            >
                <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReply}>
                    <CornerUpLeft className="mr-2 h-4 w-4" />
                    Reply
                </DropdownMenuItem>

                {isMine && (
                    <>
                        <DropdownMenuItem onClick={onEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-red-500"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}