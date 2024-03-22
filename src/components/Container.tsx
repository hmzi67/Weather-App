import { cn } from '@/utils/cn'
import React from 'react'


export default function Container(props: React.HTMLProps<HTMLDivElement>) {
    return (
        <div 
            {...props} 
            className={cn('w-full rounded-xl border border-gray-100 shadow-lg py-4 flex bg-blur ',
            props.className
        )}
        />
    )
}