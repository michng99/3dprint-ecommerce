//This is the modal provider that will be used to display the modals
"use client";

import { useEffect, useState } from "react";
import {StoreModal} from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <StoreModal/>
        </>
    )

}
