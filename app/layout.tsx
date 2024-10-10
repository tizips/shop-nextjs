import React from "react";
import {Metadata} from "next";
import {Roboto} from "next/font/google";
import {ConfigProvider} from "antd";
import {AntdRegistry} from '@ant-design/nextjs-registry';
import {GoogleTagManager} from '@next/third-parties/google'
import {doSetting} from "@/app/actions/setting";

import "@/styles/globals.scss";

const inter = Roboto({weight: ['100', '300', '400', '500', '700', '900'], subsets: ["latin"]});

import SessionClientComponent from '@/components/layout/session';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Loader from '@/components/layout/loader';

export async function generateMetadata(): Promise<Metadata> {

    const setting = await doSetting()

    return {
        title: setting['title'] ?? '',
    }
}

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    const setting = await doSetting()

    return (
        <html lang="en">
        {
            setting['google_analytics'] &&
            <GoogleTagManager gtmId={setting['google_analytics']}/>
        }
        <body className={inter.className}>
        <Loader/>
        <SessionClientComponent>
            <AntdRegistry>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: 'var(--color)',
                        }
                    }}
                >
                    <Header/>
                    {children}
                    <Footer/>
                </ConfigProvider>
            </AntdRegistry>
        </SessionClientComponent>
        </body>
        </html>
    );
}
