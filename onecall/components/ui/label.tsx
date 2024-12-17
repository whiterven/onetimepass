// src/components/ui/label.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    variant?: 'default' | 'muted';
    size?: 'sm' | 'base' | 'lg';
}


const Label = React.forwardRef<
    React.ElementRef<"label">,
    LabelProps
>(({ className, variant = 'default', size = 'base', children, ...props }, ref) => {

        const variantStyles = {
            default: "text-gray-300",
            muted: "text-gray-400"
        }

        const sizeStyles = {
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg"
        }

    return (
        <label
            ref={ref}
            className={cn(
                "block font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {children}
        </label>
    )
})
Label.displayName = "Label"

export { Label }