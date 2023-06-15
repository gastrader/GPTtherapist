import React, { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Separator } from '../ui/separator'

type ConvoLayoutProps = {
    children: ReactNode;
}

const ConvoLayout = ( {children}: ConvoLayoutProps ) => {
    return (
        <div className="hidden md:block">
            <div className="border-t">
                <div className="bg-background">
                    <div className="grid lg:grid-cols-5">
                        <Sidebar className="hidden lg:block" playlists={[]} />
                        <div className="col-span-4 flex">
                            <Separator orientation="vertical" />
                            <div className=" w-full h-full mx-10">
                                {children}
                            </div>
                        </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default ConvoLayout