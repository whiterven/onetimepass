import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils'; 

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

interface DialogOverlayProps {
  className?: string;
}

const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 bg-black bg-opacity-50", className)}
      {...props}
      ref={ref}
    />
  )
);

DialogOverlay.displayName = 'DialogOverlay';

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-0 m-auto p-4 bg-white rounded shadow-lg max-w-lg w-full", 
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = 'DialogContent';

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ 
  children, 
  className, 
  ...props 
}) => (
  <header className={cn("mb-4", className)} {...props}>
    {children}
  </header>
);

DialogHeader.displayName = 'DialogHeader';

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, className, ...props }, ref) => (
    <DialogPrimitive.Title 
      ref={ref}
      className={cn("text-xl font-bold", className)} 
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  )
);

DialogTitle.displayName = 'DialogTitle';

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <DialogPrimitive.Description 
      ref={ref}
      className={cn("text-sm text-gray-600", className)} 
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  )
);

DialogDescription.displayName = 'DialogDescription';

export { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogOverlay,
  DialogPortal
};