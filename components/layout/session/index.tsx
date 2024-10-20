'use client';  // 标记为客户端组件

import {SessionProvider} from 'next-auth/react';

export default function ClientSessionProvider({children}: { children: React.ReactNode }) {

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}